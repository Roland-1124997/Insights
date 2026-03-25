const getLocationString = (session: UserSession) => `${session.city}, ${session.country_code}`;

const getRegionName = (regionCode: string | null) => {
	if (!regionCode) return "Onbekend";

	const dutchProvinces: Record<string, string> = {
		DR: "Drenthe",
		FL: "Flevoland",
		FR: "Friesland",
		GE: "Gelderland",
		GR: "Groningen",
		LI: "Limburg",
		NB: "Noord-Brabant",
		NH: "Noord-Holland",
		OV: "Overijssel",
		UT: "Utrecht",
		ZE: "Zeeland",
		ZH: "Zuid-Holland",
	};

	return dutchProvinces[regionCode.toUpperCase()] || regionCode;
};

const deviceType = (screen: string) => {
	const width = parseInt(screen.split("x")[0] || "0");
	if (width <= 768) return "Mobiel";
	if (width <= 1024) return "Tablet";
	return "Desktop";
};

export const useAccount = defineStore("useAccount", () => {
	const store = useSessions();

	const { addToast } = useToast();
	const { create, close } = useModal();

	const uri = "/api/auth/account/sessions";
	const request = useApiHandler<ApiResponse<UserSession[]>>(uri);
	const requestFactor = useApiHandler<ApiResponse<{ uri: string; secret: string; qr_code: string }>>("/api/auth/totp");

	const sessions = ref<UserSession[] | null>(null);
	const error = ref<ErrorResponse | null>(null);
	const loading = ref<boolean>(true);

	const refresh = async () => {
		loading.value = true;

		const { data, error: Error } = await request.Get();

		if (!Error && data?.data) {
			loading.value = false;
			sessions.value = data.data;
		} else {
			loading.value = false;
			error.value = Error;

			addToast({
				message: "Er is een fout opgetreden bij het vernieuwen van de account sessies.",
				type: "error",
			});
		}
	};

	const initialPayload = async () => {
		loading.value = true;

		const { data, error: Error } = await useFetch<ApiResponse<UserSession[]>>(uri);

		if (!Error.value && data.value?.data) {
			loading.value = false;
			sessions.value = data.value.data;
		} else {
			loading.value = false;
			error.value = Error.value as unknown as ErrorResponse;

			addToast({
				message: "Er is een fout opgetreden bij het laden van de account sessies.",
				type: "error",
			});
		}
	};

	const Delete = async (sessionId: string) => {
		const onComplete = async () => {
			close();
			await refresh();
		};

		const onCancel = () => close();

		create({
			name: "Sessie Verwijderen",
			description: "Weet je zeker dat je deze sessie wilt verwijderen? Hierdoor wordt de sessie onmiddellijk afgemeld.",
			component: "Confirm",
			props: {
				onCancel,
				onComplete,
				request: {
					url: `/api/auth/account/sessions/${sessionId}`,
					method: "DELETE",
					secure: true,
				},
				message: {
					success: "Sessie succesvol verwijderd.",
					confirm: "Ja, verwijder sessie",
					cancel: "Nee, behoud sessie",
				},
			},
		});
	};

	const enableProtection = async () => {
		const { data, error } = await requestFactor.Post();
		if (error) return;

		const onComplete = async () => {
			close();
			await store.refreshSession();
		};

		const onClose = async () => {
			const { error } = await requestFactor.Delete();
			if (!error) await store.refreshSession();
			close();
		};

		create({
			name: "Tweefactorauthenticatie Instellen",
			description: "Stel tweefactorauthenticatie in om je account beter te beveiligen.",
			component: "Totp",
			props: {
				content: data?.data,
				onComplete,
				onClose,
			},
		});

		await store.refreshSession();
	};

	const disableProtection = async () => {
		const onComplete = async () => {
			close();
			await store.refreshSession();
		};

		const onCancel = () => close();

		create({
			name: "Tweefactorauthenticatie Uitschakelen",
			description: "Weet je zeker dat je tweefactorauthenticatie wilt uitschakelen? Dit vermindert de beveiliging van je account.",
			component: "Confirm",
			props: {
				onCancel,
				onComplete,
				request: {
					url: `/api/auth/totp`,
					method: "DELETE",
					secure: true,
				},
				message: {
					success: "Tweefactorauthenticatie succesvol uitgeschakeld.",
					confirm: "Ja, schakel uit",
					cancel: "Nee, behoud",
				},
			},
		});
	};

	return {
		error,
		loading,
		sessions,
		initialPayload,
		refresh,
		Delete,
		enableProtection,
		disableProtection,
		getLocationString,
		getRegionName,
		deviceType,
	};
});

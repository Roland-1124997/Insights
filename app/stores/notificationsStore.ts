type PatchResponse = ApiResponse<{ message: Inbox; unseen: number }>;

const pagination = ref<{
	page: number;
	total: number;
}>({
	page: 1,
	total: 1,
});

export const useNotifications = defineStore("useNotifications", () => {
	const { set } = useHistory();
	const { create, close } = useModal();
	const { addToast } = useToast();
	const { setBadge } = useBadge();

	const uri = "/api/notifications";
	const Request = useApiHandler<ApiResponse<{ messages: Inbox[]; unseen: number }>>(uri);

	const loading = ref<boolean>(true);
	const selected = ref<Inbox | null>(null);
	const messages = ref<(Inbox & { showDropdown?: boolean })[]>([]);
	const unseen = ref<number>(0);
	const error = ref<ErrorResponse | null>(null);

	const route = useRoute();

	const activeMessageId = computed(() => route.query.id);

	const alert = computed<{ value: number }>(() => {
		return { value: unseen.value };
	});

	const storedPayload = useLocalStorage<string | null>("notification:payload", null);
	const savePayload = async (payload: any) => (storedPayload.value = JSON.stringify(payload));
	const clearSavedPayload = () => (storedPayload.value = null);

	const getSavedPayload = () => {
		if (storedPayload.value) return JSON.parse(storedPayload.value);
		return null;
	};

	const updateMessageInList = (data: any, flagOnly?: boolean) => {
		const index = messages.value.findIndex((msg: any) => msg.uid === data.uid);
		const currentPage = Number(useRoute().query.page || 1);

		if (index === -1 && !flagOnly && currentPage == 1) {
			messages.value.unshift(data);
			messages.value.pop();
		} else {
			const oldMessage = messages.value[index];
			const updatedMessage = flagOnly
				? {
						...oldMessage,
						flags: data.flags,
					}
				: {
						...oldMessage,
						...data,
					};

			messages.value[index] = updatedMessage;

			if (selected.value?.uid === data.uid) {
				selected.value = updatedMessage;
			}
		}
	};

	const updateUnseenCount = async (count: number) => {
		unseen.value = count;
		await setBadge(count);
	};

	watch(unseen, async (count) => await setBadge(count), { immediate: true });
	watch(
		() => route.path,
		() => (selected.value = null),
	);

	const refresh = async (params?: { filter?: string; page?: number; search?: string }) => {
		loading.value = true;
		await new Promise((resolve) => setTimeout(resolve, 300));

		const query = {
			page: params?.page || useRoute().query.page || pagination.value.page || 1,
			filter: params?.filter || useRoute().query.filter || "alles",
			search: params?.search !== undefined ? params.search : useRoute().query.search || "",
		} as { filter: string; page: number; search: string };

		set("/berichten", [query]);

		const { data, error: Error } = await Request.Get({
			query: { ...query },
		});

		if (!Error && data) {
			loading.value = false;

			const currentPage = Number(useRoute().query.page || 1);
			const totalPages = data.pagination?.total || 1;

			pagination.value.page = data.pagination?.page || 1;
			pagination.value.total = data.pagination?.total || 1;

			messages.value = data.data?.messages || [];
			unseen.value = data.data?.unseen || 0;

			if (currentPage > totalPages) return await toPage(totalPages);
		} else {
			loading.value = false;
			error.value = Error;
			addToast({
				message: "Er is een fout opgetreden bij het verversen van de berichten.",
				type: "error",
			});
		}
	};

	const initialPayload = async () => {
		loading.value = true;

		const route = useRoute();
		const activePage = route.path === "/berichten";

		const params = {
			page: activePage ? route.query.page || pagination.value.page || 1 : 1,
			filter: activePage ? route.query.filter || "alles" : "alles",
			search: activePage ? route.query.search || "" : "",
		} as { filter: string; page: number; search: string };

		set("/berichten", [params]);

		const { data, error: Error } = await useFetch<ApiResponse<any>>("/api/notifications", {
			query: { ...params },
		});

		if (!Error.value && data.value) {
			loading.value = false;
			pagination.value.page = data.value?.pagination?.page || 1;
			pagination.value.total = data.value?.pagination?.total || 1;

			messages.value = data.value?.data.messages || [];
			unseen.value = data.value?.data.unseen || 0;
			await setBadge(unseen.value);
		} else {
			loading.value = false;
			error.value = Error.value as unknown as ErrorResponse;
			addToast({
				message: "Er is een fout opgetreden bij het ophalen van berichten.",
				type: "error",
			});
		}
	};

	const realTime = async () => {
		const event_id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

		const {
			data: events,
			error: Error,
			close,
		} = useEventSource(`/realtime/${event_id}/notifications/`, [], {
			autoReconnect: {
				retries: 5,
				onFailed: () => {
					addToast({
						message: "Verbinding met notificatie server verbroken.",
						type: "error",
					});
				},
			},
		});

		watch(events, async (response) => {
			const { data, unseen, events } = JSON.parse(response);

			if (events.deleted) await refresh();

			if (data) {
				if (events.update) updateMessageInList(data, true);
				if (events.incoming) updateMessageInList(data);
			}

			updateUnseenCount(unseen).catch(() => {});
		});

		if (Error.value) error.value = Error.value as unknown as ErrorResponse;

		return { close };
	};

	const markAsSeen = async (message: any) => {
		if (message.flags.includes("\\Seen")) return;

		updateUnseenCount(unseen.value - 1).catch(() => {});
		updateMessageInList(
			{
				uid: message.uid,
				flags: ["\\Seen"],
			},
			true,
		);

		const { data, error } = await Request.Patch<PatchResponse>({
			extends: `/${message.uid}`,
			query: { action: "markAsSeen" },
		});

		if (error) {
			updateUnseenCount(unseen.value + 1).catch(() => {});
			updateMessageInList(
				{
					uid: message.uid,
					flags: [],
				},
				true,
			);

			return addToast({
				type: "error",
				message: `Fout bij het markeren van de notificatie als gelezen:`,
			});
		}

		if (data && data.data) {
			updateMessageInList(data.data.message, true);
			updateUnseenCount(data.data.unseen).catch(() => {});
		}
	};

	const markAsUnseen = async (message: any) => {
		if (!message.flags.includes("\\Seen")) return;

		updateUnseenCount(unseen.value + 1).catch(() => {});
		updateMessageInList(
			{
				uid: message.uid,
				flags: [],
			},
			true,
		);

		const { data, error } = await Request.Patch<PatchResponse>({
			extends: `/${message.uid}`,
			query: { action: "markAsUnseen" },
		});

		if (error) {
			updateUnseenCount(unseen.value - 1).catch(() => {});
			updateMessageInList(
				{
					uid: message.uid,
					flags: ["\\Seen"],
				},
				true,
			);

			return addToast({
				type: "error",
				message: `Fout bij het markeren van de notificatie als ongelezen:`,
			});
		}

		if (data && data.data) {
			updateMessageInList(data.data.message, true);
			updateUnseenCount(data.data.unseen).catch(() => {});
		}
	};

	const deleteMessage = async (message: any) => {
		const onComplete = async () => {
			close();
			await refresh();
		};

		const onCancel = () => close();

		create({
			name: message.subject || "Geen onderwerp",
			description: "Weet je zeker dat je dit bericht wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
			component: "Confirm",
			props: {
				onCancel,
				onComplete,
				request: {
					url: `/api/notifications/${message.uid}`,
					method: "DELETE",
					secure: false,
				},
				message: {
					success: "Bericht succesvol verwijderd",
					confirm: "Ja, verwijder het bericht",
					cancel: "Nee, behoud het bericht",
				},
			},
		});
	};

	const compose = async (payload: Record<string, any>) => {
		await savePayload(payload);

		const router = useRouter();

		router
			.push({
				path: "/berichten/opstellen",
				query: {
					reply: "true",
				},
			})
			.catch(() => {});
	};

	const selectMessage = async (message: any) => {
		selected.value = message;

		const router = useRouter();

		router
			.replace({
				query: {
					...useRoute().query,
					id: message.id,
				},
			})
			.catch(() => {});

		const isMobile = import.meta.client && window.innerWidth <= 768;

		if (isMobile) {
			create({
				hideOnDesktop: true,
				name: message.subject || "Geen onderwerp",
				description: "Bekijk de volledige inhoud van dit bericht.",
				component: "Email",
				props: {
					message,
					onConfirm: (payload: Record<string, any>) => {
						compose(payload).catch(() => {});
						backToList();
						close();
					},
					onClose: () => {
						backToList();
						close();
					},
				},
			});
		}

		await markAsSeen(message);
	};

	const backToList = () => {
		selected.value = null;

		const router = useRouter();

		router
			.replace({
				query: {
					...useRoute().query,
					id: undefined,
				},
			})
			.catch(() => {});
	};

	const openMessageById = async (id: string) => {
		const messageToOpen = messages.value.find((msg: any) => {
			return msg.id === id;
		});

		if (messageToOpen) await selectMessage(messageToOpen);
	};

	const nextPage = async () => {
		if (pagination.value.page < pagination.value.total) {
			pagination.value.page += 1;

			const router = useRouter();
			router
				.replace({
					query: {
						...useRoute().query,
						page: pagination.value.page,
					},
				})
				.catch(() => {});

			await navigateToPage(pagination.value.page);
		}
	};

	const previousPage = async () => {
		if (pagination.value.page > 1) {
			pagination.value.page -= 1;

			const router = useRouter();
			router
				.replace({
					query: {
						...useRoute().query,
						page: pagination.value.page,
					},
				})
				.catch(() => {});

			await navigateToPage(pagination.value.page);
		}
	};

	const toPage = async (page: number) => {
		if (page >= 1 && page <= pagination.value.total) {
			pagination.value.page = page;

			const router = useRouter();
			router
				.replace({
					query: {
						...useRoute().query,
						page: pagination.value.page,
					},
				})
				.catch(() => {});

			await navigateToPage(pagination.value.page);
		}
	};

	const navigateToPage = async (page: number) => {
		loading.value = true;
		await new Promise((resolve) => setTimeout(resolve, 500));
		await refresh({ page: page });

		loading.value = false;
	};

	return {
		loading,
		messages,
		selected,
		alert,
		error,
		activeMessageId,
		pagination,
		openMessageById,
		clearSavedPayload,
		savePayload,
		getSavedPayload,
		initialPayload,
		realTime,
		markAsSeen,
		markAsUnseen,
		deleteMessage,
		refresh,
		compose,
		selectMessage,
		backToList,
		nextPage,
		previousPage,
		toPage,
	};
});

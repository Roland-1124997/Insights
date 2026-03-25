export const usePush = async () => {
	const { vapidPublicKey } = useRuntimeConfig().public;
	const vapidKey = vapidPublicKey?.trim().replace(/['",]/g, "");

	const url = "/api/integrations/subscription";
	const { Post, Delete } = useApiHandler(url);

	const { addToast } = useToast();
	const active = ref(false);

	const channel = new BroadcastChannel("sw-messages");

	channel.addEventListener("message", (event) => {
		const { type, payload } = event.data;
		if (type === "SUBSCRIPTION_UPDATED") active.value = payload.active;
	});

	const { data, error } = await useFetch<
		ApiResponse<{
			active: boolean;
			subscriptions: {
				id: string;
				expiration_time: string;
				endpoint: string;
			}[];
		}>
	>(url);
	if (!error.value && data.value?.data) active.value = data.value.data.active;

	const subscribe = async () => {
		try {
			const permission = await Notification.requestPermission();

			if (permission !== "granted") {
				addToast({
					message: `Notification permisions denied`,
					type: "error",
					duration: 5000,
				});
				return;
			}

			if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
				addToast({
					message: "Push not supported in this browser.",
					type: "error",
					duration: 5000,
				});
				return;
			}

			const registration = await navigator.serviceWorker.ready;
			if (!registration) return;

			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(vapidKey),
			});

			if (!subscription) return;

			const { error } = await Post({ body: subscription });

			if (error)
				return addToast({
					message: `Subscription to push notifications failed`,
					type: "error",
					duration: 5000,
				});

			addToast({
				message: "Subscribed to push notifications successfully.",
				type: "success",
				duration: 5000,
			});

			active.value = true;
		} catch (error: any) {
			addToast({
				message: `An error occurred: ${error}`,
				type: "error",
				duration: 5000,
			});
		}
	};

	const unsubscribe = async () => {
		try {
			if (!("serviceWorker" in navigator)) {
				addToast({
					message: "Service Worker not available.",
					type: "error",
					duration: 5000,
				});
				return;
			}

			const registration = await navigator.serviceWorker.ready;
			const subscription = await registration.pushManager.getSubscription();

			if (!subscription) {
				await Delete();
				addToast({
					message: "Server subscription removed (no active push subscription found).",
					type: "info",
					duration: 3000,
				});
				active.value = false;
				return;
			}

			const success = await subscription.unsubscribe();
			if (!success) {
				throw new Error("Failed to unsubscribe from push");
			}

			const { error } = await Delete();

			if (error)
				return addToast({
					message: `Failed to remove server subscription: ${error as any}`,
					type: "error",
					duration: 5000,
				});

			addToast({
				message: "Unsubscribed from push notifications successfully.",
				type: "success",
				duration: 5000,
			});
			active.value = false;
		} catch (error: any) {
			addToast({
				message: `Unsubscribe failed: ${error}`,
				type: "error",
				duration: 5000,
			});
		}
	};

	const syncSubscription = async () => {
		await postToWorker("SET_VAPID_KEY", {
			vapidKey: urlBase64ToUint8Array(vapidKey),
		});
		await postToWorker("SET_TOKEN_HEADER", { headers: useControlToken() });
		await postToWorker("CHECK_SUBSCRIPTION");
	};

	return { subscribe, unsubscribe, syncSubscription, active };
};

const postToWorker = async (type: string, payload: Record<string, unknown> | null = null) => {
	const registration = await navigator.serviceWorker.getRegistration();
	if (registration?.active) registration.active.postMessage({ type, payload });
};

const urlBase64ToUint8Array = (base64String: string) => {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
};

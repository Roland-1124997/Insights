<template>
	<UtilsApp>
		<div aria-hidden class="absolute top-0 left-0 w-1 h-1 overflow-hidden">
			<NuxtImg src="/github.jpg" />
		</div>

		<UtilsNavigation>
			<main class="flex-1 p-4 overflow-x-hidden overflow-y-auto">
				<div class="mx-auto">
					<slot></slot>
				</div>
			</main>
		</UtilsNavigation>
	</UtilsApp>
</template>

<script setup lang="ts">
	const account = useAccount();
	const store = useAnalytics();
	const monitor = useMonitor();
	const session = useSessions();
	const articles = useArticles();
	const storageStore = useStorage();
	const notifications = useNotifications();

	const route = useRoute();

	const { related } = await useApiRoutes();

	watch(
		() => route.path,
		async () => {
			if (route.path !== "/artikelen/opstellen") articles.clearSavedPayload();
			if (related.value) await store.setShared(related.value);
		},
		{ immediate: true },
	);

	store.initialPayload();
	account.initialPayload();
	monitor.initialPayload();
	articles.initialPayload();
	storageStore.initialPayload();
	notifications.initialPayload();
	const { syncSubscription } = await usePush();

	const { close } = await notifications.realTime();

	const isVisible = ref(true);

	const handleVisibilityChange = () => {
		isVisible.value = document.visibilityState === "visible";
		if (isVisible.value) session.refreshSession();
	};

	onMounted(async () => {
		session.setCloseFunction(close);

		await syncSubscription();

		if (store.error) store.refresh();
		if (account.error) account.refresh();
		if (articles.error) articles.refresh();
		if (monitor.error) monitor.refresh();
		if (storageStore.error) storageStore.refresh();
		if (notifications.error) notifications.refresh();

		document.addEventListener("visibilitychange", handleVisibilityChange);
	});

	onUnmounted(() => {
		close();
		document.removeEventListener("visibilitychange", handleVisibilityChange);
	});
</script>

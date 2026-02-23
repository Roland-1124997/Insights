<template>
	<UtilsApp>
		<UtilsNavigation>
			<main class="flex-1 p-4 overflow-y-auto ">
				<div class="mx-auto">
					<slot></slot>
				</div>
			</main>
		</UtilsNavigation>
	</UtilsApp>
</template>

<script setup lang="ts">

	useSearch();
	useFilter()

	const account = useAccount();
	const store = useAnalytics();
	const articles = useArticles();
	const session = useSessions();
	const storageStore = useStorage();
	const notifications = useNotifications();

	const route = useRoute();

	watch(() => route.path, () => {
		if(route.path !== '/artikelen/opstellen') articles.clearSavedPayload()
	}, { immediate: true } )

	store.initialPayload();
	account.initialPayload();
	articles.initialPayload();
	storageStore.initialPayload();
	notifications.initialPayload();

	const { close } = await notifications.realTime();

	onMounted(async () => {
		
		session.setCloseFunction(close);

		if(store.error) store.refresh()
		if(account.error) account.refresh()
		if(articles.error) articles.refresh()
		if(storageStore.error) storageStore.refresh()
		if(notifications.error) notifications.refresh()
	});

	onUnmounted(() => close());

</script>


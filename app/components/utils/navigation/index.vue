<template>
	<UtilsNavigationSidebar v-model:isMobileMenuOpen="isMobileMenuOpen" :routes />

	<div class="flex flex-col flex-1 w-full overflow-hidden">
		<header class="z-40 flex items-center justify-between h-16 px-4 bg-white border-b lg:px-6">
			<div class="flex items-center gap-4">
				<button aria-label="open sidebar navigatie" @click="isMobileMenuOpen = true" class="flex items-center justify-center p-2 rounded-lg lg:hidden hover:bg-gray-100">
					<Icon name="akar-icons:text-align-justified" class="w-5 h-5" />
					<span class="sr-only">Open menu</span>
				</button>

				<Breadcrumbs />
			</div>
			<div class="sticky top-0 left-0 flex items-center justify-between w-full gap-2 p-1"></div>

			<div class="flex items-center gap-2 md:hidden">
				<UtilsButton to="/berichten" iconName="akar-icons:inbox" :options="{ count: notifications.alert.value }" />
			</div>
		</header>

		<TransitionGroup name="page">
			<div class="flex flex-col flex-1 w-full overflow-hidden" v-if="!isLoading">
				<UtilsNavigationToolbar :toolbar :related />
				<slot></slot>
			</div>
		</TransitionGroup>
	</div>
</template>

<script setup lang="ts">
	const { error, routes, toolbar, related, refresh } = await useApiRoutes();

	const notifications = useNotifications();
	const isMobileMenuOpen = ref(false);

	onMounted(async () => {
		if (error.value) await refresh();
	});

	const isLoading = ref(false);
	const route = useRoute();

	watch(
		() => route.path,
		(path) => {
			isLoading.value = true;

			setTimeout(() => {
				isLoading.value = false;
			}, 200);
		},
	);
</script>

<style>
	.page-enter-active,
	.page-leave-active {
		transition: all 0.2s ease-in-out;
	}

	.page-enter-from,
	.page-leave-to {
		opacity: 0;
	}
</style>

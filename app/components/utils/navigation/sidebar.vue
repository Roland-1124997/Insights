<template>
	<aside
		:class="[
			'fixed inset-y-0 left-0 z-[60] w-64 bg-gray-50 border-r transform transition-transform md:transition-none duration-300 ease-in-out lg:translate-x-0 h-full lg:static lg:inset-0',
			isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
		]">
		<div class="flex flex-col h-full select-none">
			<div class="flex items-center justify-between h-16 px-4 border-b">
				<div class="flex items-center space-x-3">
					<div class="flex items-center justify-center w-8 h-8 overflow-hidden bg-blue-600 rounded-lg">
						<img src="\svgs\icon_512-blue.svg" alt="Insights Logo" draggable="false" class="rounded-lg w-7 h-7" />
					</div>
					<h1 class="text-xl font-bold text-blue-950">Insights</h1>
				</div>

				<button aria-label="sluit sidebar menu" @click="isMobileMenuOpen = false" class="flex items-center justify-center p-2 rounded-lg lg:hidden hover:bg-gray-100">
					<Icon name="akar-icons:x-small" size="1.6rem" />
					<span class="sr-only">Sluit menu</span>
				</button>
			</div>

			<nav id="sidebar-menu" aria-label="Hoofdnavigatie" class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
				<NuxtLink
					v-for="(route, to) in routes"
					v-show="!route.hidden"
					:key="to"
					:to="`${to}`"
					:class="routerActiveRelatedClass(route, to)"
					class="flex items-center gap-3 px-3 py-2 text-gray-700 transition-colors rounded-lg hover:bg-blue-100 hover:text-blue-800"
					@click="clickAction(route)">
					<Icon :name="route.iconName" class="w-5 h-5" />
					<span class="flex-1">{{ route.label }}</span>
					<span
						v-if="route.alert && Number(useAlertCount(route.toolbar?.store)) > 0"
						class="inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-h-5 min-w-5 h-fit w-fit">
						{{ useAlertCount(route.toolbar?.store, true) }}
					</span>
				</NuxtLink>
			</nav>

			<div v-if="Object.keys(routes).length > 0" class="p-3 mb-3 border-t md:mb-0">
				<button aria-label="uitlogen" @click="store.logout" class="flex items-center w-full gap-3 px-3 py-2 text-gray-700 transition-colors rounded-lg hover:bg-red-50 hover:text-red-600">
					<Icon name="akar-icons:door" class="w-5 h-5" />
					<span>Uitloggen</span>
				</button>
			</div>
		</div>
	</aside>

	<div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 z-50 bg-black bg-opacity-50 lg:hidden"></div>
</template>

<script setup lang="ts">
	const store = useSessions();
	const route = useRoute();

	const isMobileMenuOpen = defineModel<boolean>("isMobileMenuOpen");
	const { routes } = defineProps<{ routes: Record<string, RouteType> }>();

	const clickAction = (route: RouteType) => {
		isMobileMenuOpen.value = false;
		if (route.refetchOnEnter) useRefreshCurrentStore(route.toolbar?.store);
	};

	const routerActiveRelatedClass: any = (config: RouteType, to: string) => {
		const path = route.path.replace("/", "");
		const target = to.replace("/", "");

		const className = "router-link-related-active";
		const isRelated = (to !== "/" && path.startsWith(target)) || config.related?.includes(route.path);

		return isRelated ? className : "";
	};
</script>

<style scoped>
	.router-link-related-active {
		@apply text-blue-800 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200;
	}

	.router-link-active {
		@apply text-blue-800 bg-blue-100 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300;
	}
</style>

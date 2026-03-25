<template>
	<div>
		<UtilsApp>
			<UtilsNavigationSidebar v-if="Object.keys(routes).length > 0" v-model:isMobileMenuOpen="isMobileMenuOpen" :routes />

			<div class="flex flex-col flex-1 w-full overflow-hidden">
				<header class="z-40 flex items-center justify-between h-16 px-4 bg-white border-b lg:px-6">
					<div class="flex items-center gap-4">
						<button
							v-if="Object.keys(routes).length > 0"
							aria-label="open sidebar navigatie"
							@click="isMobileMenuOpen = true"
							class="flex items-center justify-center p-2 rounded-lg lg:hidden hover:bg-gray-100">
							<Icon name="akar-icons:text-align-justified" class="w-5 h-5" />
							<span class="sr-only">Open menu</span>
						</button>

						<Breadcrumbs />
					</div>
					<div class="sticky top-0 left-0 flex items-center justify-between w-full gap-2 p-1"></div>
				</header>

				<main class="flex items-start justify-center w-full h-full mt-16 md:mt-0 md:items-center">
					<div class="flex flex-col items-start gap-1 px-6 text-left">
						<div v-if="error" class="flex flex-col items-start gap-2">
							<p class="inline-flex items-center gap-2 px-4 py-2 mb-2 font-mono text-sm font-semibold text-white bg-black rounded-full">
								<span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
								Error: {{ error.status }}
							</p>
						</div>

						<h1 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 md:text-6xl">
							{{ message || "Er is iets misgegaan" }}
						</h1>

						<p class="mb-4 text-gray-500 text-left text-base md:text-2xl max-w-[22rem] md:max-w-[35rem]">
							{{ statusMessage }}
						</p>

						<DevOnly>
							{{ error?.stack }}
						</DevOnly>

						<UtilsButtonAction iconName="akar-icons:arrow-left" :options="{ name: 'Terug naar start', always: true }" @click="handleError" />
					</div>
				</main>
			</div>
		</UtilsApp>
	</div>
</template>

<script setup lang="ts">
	const { routes } = await useApiRoutes();

	const error = useError();
	const isMobileMenuOpen = ref(false);

	const { message, statusMessage } = (error.value?.status && useStatusCodes[error.value.status]) || { message: "", statusMessage: "" };

	const handleError = () => {
		return clearError({ redirect: "/" });
	};
</script>

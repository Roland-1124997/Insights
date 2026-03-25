<template>
	<div class="z-40 flex items-center gap-2 px-[0.15rem] pt-[0.15rem] pb-3">
		<div v-if="store.pagination.page - 1 != 0" class="flex items-center w-full gap-2">
			<button
				:disabled="store.loading"
				@click="store.toPage(1)"
				class="flex w-full items-center justify-center gap-2 px-3 py-[0.64rem] text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
				aria-label="Beantwoord dit bericht">
				<icon name="akar-icons:chevron-left" class="w-4 h-4" aria-hidden="true" />
				<icon name="akar-icons:chevron-left" class="w-4 h-4 -ml-4" aria-hidden="true" />
				<span class="sr-only">Vorige pagina</span>
			</button>

			<button
				:disabled="store.loading"
				@click="store.previousPage"
				class="flex items-center justify-center w-full gap-2 px-5 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
				aria-label="Beantwoord dit bericht">
				{{ store.pagination.page - 1 }}
			</button>
		</div>

		<div
			class="flex items-center justify-center w-full gap-2 px-5 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
			<icon v-if="store.loading" name="akar-icons:arrow-cycle" class="w-4 h-4 py-[0.635rem] animate-spin" aria-hidden="true" />
			<p v-else>{{ store.pagination.page }}</p>
		</div>

		<div v-if="store.pagination.page + 1 <= store.pagination.total" class="flex items-center w-full gap-2">
			<button
				:disabled="store.loading"
				@click="store.nextPage"
				class="flex items-center justify-center w-full gap-2 px-5 py-2 text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
				aria-label="Beantwoord dit bericht">
				{{ store.pagination.page + 1 }}
			</button>

			<button
				:disabled="store.loading"
				@click="store.toPage(store.pagination.total)"
				class="flex w-full items-center justify-center gap-2 px-3 py-[0.64rem] text-sm font-medium text-blue-600 transition-colors duration-200 border border-blue-300 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
				aria-label="Beantwoord dit bericht">
				<icon name="akar-icons:chevron-right" class="w-4 h-4 -mr-4" aria-hidden="true" />
				<icon name="akar-icons:chevron-right" class="w-4 h-4" aria-hidden="true" />

				<span class="sr-only">Volgende pagina</span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const store = useNotifications();
</script>

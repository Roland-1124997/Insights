<template>
	<section class="grid w-full grid-cols-1 mt-3 gap-y-3 md:gap-3 md:grid-cols-2 h-fit pb-[5.5rem] md:pb-0">
		<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h2 class="text-xl font-bold text-gray-900">Actieve Sessies</h2>
					<p class="mt-1 text-sm text-gray-600">
						{{ sessions?.length || 0 }} actieve
						{{ sessions?.length === 1 ? "sessie" : "sessies" }}
					</p>
				</div>
			</div>

			<div v-if="sessions && sessions.length" class="grid gap-3 md:grid-cols-2">
				<div v-for="(inner_session, index) in sessions" :key="inner_session.id" class="relative pt-5 bg-white border-t md:border md:p-5 md:rounded-xl">
					<UtilsAccountViewerSessionsCard :session="inner_session" />
				</div>
			</div>

			<div v-else class="p-12 text-center text-gray-500">
				<div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
					<icon name="akar-icons:laptop-device" class="w-8 h-8 text-gray-400" />
				</div>
				<p class="text-lg font-medium">Geen actieve sessies gevonden</p>
				<p class="mt-1 text-sm">Log opnieuw in om een sessie te starten</p>
			</div>
		</article>
	</section>
</template>

<script setup lang="ts">
	defineProps({
		sessions: {
			type: Object as PropType<UserSession[]>,
			required: true,
		},
	});
</script>

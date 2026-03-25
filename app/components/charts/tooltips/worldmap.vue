<template>
	<div class="w-64 p-1 rounded-xl">
		<div class="flex items-center gap-1">
			<div v-if="data.count > 0" class="w-3 h-3 rounded-full" :style="localStyle"></div>
			<p class="font-bold text-normal">
				{{ useCounryName(data.id) }}
			</p>
		</div>

		<p v-if="data.count > 0" class="text-sm">In deze periode zijn de volgende statistieken geregistreerd:</p>
		<p v-else class="mb-4 text-sm text-gray-500">Er zijn geen statistieken geregistreerd voor dit land in deze periode.</p>

		<div v-if="data.count > 0" class="mt-4">
			<p class="text-sm text-gray-500">
				<strong>{{ useFormatDuration(data.count || 0) }}</strong> unieke bezoeker{{ data.count !== 1 ? "s" : "" }}
			</p>
			<p class="text-sm text-gray-500">
				<strong>{{ useFormatDuration(data.visits || 0) }}</strong> bezoek{{ data.visits !== 1 ? "en" : "" }}
			</p>
			<p class="text-sm text-gray-500">
				<strong>{{ useFormatDuration(data.views || 0) }}</strong> weergave{{ data.views !== 1 ? "s" : "" }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { data } = defineProps({
		data: {
			type: Object as () => Record<string, any>,
			required: true,
		},
	});

	const localStyle = computed(() => {
		const color = data.areaColor ? data.areaColor(data) : "#dbeafe";

		return { background: color };
	});
</script>

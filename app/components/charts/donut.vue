<script setup lang="ts">
	const { data, height, categories, active } = defineProps({
		data: {
			type: Array as () => Record<string, any>[],
			required: true,
		},
		height: {
			type: Number,
			default: 225,
		},
		categories: {
			type: Object as () => Record<string, { name: string; color: string }>,
			required: true,
		},
		arcWidth: {
			type: Number,
			default: 40,
		},
		active: {
			type: String,
			required: false,
			default: "bezoekers",
		},
	});

	const localCategories = computed(() => {
		const availableCategories: Record<string, { name: string; color: string }> = {};

		data.forEach((item: any) => {
			const key = item.label.toLowerCase();
			if (categories[key]) availableCategories[key] = categories[key];
		});

		return availableCategories;
	});

	const localData = computed(() => {
		return data.map((item: any) => item[active]);
	});
</script>

<template>
	<DonutChart
		:data="localData"
		:height
		:categories="localCategories"
		:radius="160"
		:pad-angle="0.1"
		:arc-width="arcWidth"
		:legend-position="LegendPosition.TopLeft"
		:hide-legend="false"
		:legend-style="{ marginBottom: '2rem' }">
		<div class="text-center">
			<div class="text-lg font-semibold capitalize">{{ active }}</div>
			<div class="text-muted">
				{{ useFormatDuration(localData.reduce((a, b) => a + b, 0)) }}
			</div>
		</div>

		<template #tooltip="{ values }">
			<ChartsTooltipsDonut :categories="categories" :active="active" :values="values" />
		</template>
	</DonutChart>
</template>

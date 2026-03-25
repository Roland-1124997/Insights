<script setup lang="ts">
	import { WorldMapTopoJSON } from "@unovis/ts/maps";

	import { geoMercator } from "d3-geo";

	const { data, height, zoomExtent } = defineProps({
		data: {
			type: Object,
			default: () => ({}),
		},
		height: {
			type: Number,
			default: 400,
		},
		zoomExtent: {
			type: Array as unknown as () => [number, number],
			default: () => [1, 5],
		},
	});

	const ChoroplethMapData = computed(() => {
		return data.map((d: any) => ({
			id: d.label,
			count: d.bezoekers,
			views: d.weergaven,
			visits: d.bezoeken,
		}));
	});

	const worldData = computed(() => ({
		areas: ChoroplethMapData.value,
	}));

	const maxCount = computed(() => Math.max(...worldData.value.areas.map((d: { count: number }) => d.count)));

	const areaColor = computed(() => {
		return (d: any) => {
			if (!d.count) return "#e5e7eb";
			const t = d.count / maxCount.value;
			const lightness = 70 - t * 40;
			return `hsl(240, 70%, ${lightness}%)`;
		};
	});

	const mapHeight = ref(height);

	const updateHeight = () => {
		if (window.innerWidth < 768) mapHeight.value = height;
		else mapHeight.value = 520;
	};

	onMounted(() => {
		updateHeight();
		window.addEventListener("resize", updateHeight);
	});

	onUnmounted(() => window.removeEventListener("resize", updateHeight));

	const customProjection = geoMercator().center([0, 0]);
</script>

<template>
	<div class="overflow-hidden bg-blue-200 border rounded-lg">
		<TopoJSONMap map-feature-key="countries" :height="mapHeight" :zoom-extent="zoomExtent" :projection="customProjection" :data="worldData" :topo-json="WorldMapTopoJSON" :area-color="areaColor">
			<template #tooltip="{ values }">
				<ChartsTooltipsWorldmap :data="{ ...values, areaColor }" />
			</template>
		</TopoJSONMap>
	</div>
</template>

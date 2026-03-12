<template>
	<div>
		<h1 class="mb-1 text-2xl font-bold">Statistieken Apparaten</h1>
		<p class="mb-6 text-sm text-gray-500">Hier kun je alle statistieken van de apparaten bekijken.</p>

		<UtilsTable name="devices" :data="store.metrics?.devices.values || []" :categories />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Statistieken Apparaten",
		description: "Bekijk alle statistieken van de apparaten, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogTitle: "Statistieken Apparaten",
		ogDescription: "Bekijk alle statistieken van de apparaten, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogUrl: "/statistieken/apparaten",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Statistieken Apparaten",
		twitterDescription: "Bekijk alle statistieken van de apparaten, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		twitterImage: "/icons/icon_512.png",
		twitterCard: "app",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/png",
				href: "/icons/icon_512.png",
			},
		],
	});

	const store = useAnalytics();

	const categories = [
		{
			label: "Apparaat",
			value: "label",
		},
		{
			label: "Weergaven",
			value: "weergaven",
		},
		{
			label: "Bezoekers",
			value: "bezoekers",
		},
		{
			label: "Bezoeken",
			value: "bezoeken",
		},
		{
			label: "Bounces",
			value: "bounces",
		},
		{
			label: "Sessie duur",
			value: "totaltime",
		},
	];
</script>

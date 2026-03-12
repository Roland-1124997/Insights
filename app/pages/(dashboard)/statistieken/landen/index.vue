<template>
	<div>
		<h1 class="mb-1 text-2xl font-bold">Statistieken Landen</h1>
		<p class="mb-6 text-sm text-gray-500">Hier kun je alle statistieken van de landen bekijken.</p>

		<UtilsTable name="countries" :data="store.metrics?.countries.values || []" :categories />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Statistieken Landen",
		description: "Bekijk alle statistieken van de landen, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogTitle: "Statistieken Landen",
		ogDescription: "Bekijk alle statistieken van de landen, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
		ogUrl: "/statistieken/landen",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Statistieken Landen",
		twitterDescription: "Bekijk alle statistieken van de landen, inclusief weergaven, bezoekers, bezoeken en sessieduur.",
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
			label: "Land",
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

<template>
	<div>
		<h1 class="mb-1 text-2xl font-bold">Statistieken Pagina's</h1>
		<p class="mb-6 text-sm text-gray-500">Hier kun je alle statistieken van de pagina's bekijken.</p>

		<UtilsTable name="pages" :data="store.metrics?.pages.values || []" :categories />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Statistieken Pagina's",
		description: "Bekijk alle statistieken van de pagina's op je website, inclusief weergaven, bezoekers en bounces.",
		ogTitle: "Statistieken Pagina's",
		ogDescription: "Bekijk alle statistieken van de pagina's op je website, inclusief weergaven, bezoekers en bounces.",
		ogUrl: "/statistieken/paginas",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Statistieken Pagina's",
		twitterDescription: "Bekijk alle statistieken van de pagina's op je website, inclusief weergaven, bezoekers en bounces.",
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
			label: "Pagina",
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

<template>
	<div>
		<h1 class="hidden mb-6 text-2xl font-bold md:flex">Statistieken Overzicht</h1>

		<section class="relative grid grid-cols-2 gap-3 md:grid-cols-4">
			<template v-if="store.statistics">
				<ClientOnly>
					<UtilsAnalyticsQuickView :data="store.statistics || []" />
					<template #fallback>
						<UtilsAnalyticsSkeleton />
					</template>
				</ClientOnly>
			</template>

			<template v-else>
				<UtilsAnalyticsSkeleton />
			</template>
		</section>

		<section class="grid w-full grid-cols-1 mt-3 gap-y-3 md:gap-3 md:grid-cols-3 h-fit pb-[5.5rem] md:pb-0">
			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
				<h2 class="mb-1 text-xl font-bold">Meest bezochte pagina's</h2>
				<UtilsAnalyticsChartsPages :metrics="store.metrics || []" :data="store.metrics?.pages || []" />
			</article>

			<article class="w-full col-span-1 p-6 bg-white border rounded-lg">
				<h2 class="mb-1 text-xl font-bold">Meest gebruikte apparaten</h2>
				<p class="mb-1 text-sm text-gray-600">Meest gebruikte apparaten van je bezoekers</p>

				<NuxtLink to="/statistieken/apparaten" class="inline-flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline">
					Meer details
					<icon name="akar-icons:arrow-right" class="w-4 h-4 ml-1" />
				</NuxtLink>
				<UtilsAnalyticsChartsDevices :metrics="store.metrics || []" :data="store.metrics?.devices || []" />
			</article>

			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-3">
				<div class="flex flex-col justify-between w-full md:items-center md:flex-row">
					<div class="mb-1 md:mb-6">
						<h2 class="mb-1 text-xl font-bold">Breakdown per pagina</h2>
						<p class="text-sm text-gray-600">Meest bezochte pagina's van je website</p>
					</div>

					<NuxtLink to="/statistieken/pagina's" class="inline-flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline">
						Meer details
						<icon name="akar-icons:arrow-right" class="w-4 h-4 ml-1" />
					</NuxtLink>
				</div>

				<UtilsAnalyticsCardsViewer name="pages" :visable="6" :data="store.metrics?.pages.values || []" />
			</article>

			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
				<h2 class="mb-1 text-xl font-bold">Bezoekers per land</h2>
				<p class="mb-6 text-sm text-gray-600">Een visuele weergave van waar je bezoekers vandaan komen,</p>
				<UtilsAnalyticsChartsWorld :metrics="store.metrics || []" :data="store.metrics?.countries.values || []" />
			</article>

			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-1">
				<h2 class="mb-1 text-xl font-bold">Top landen</h2>
				<p class="mb-1 text-sm text-gray-600">De landen waaruit je meeste bezoekers komen,</p>

				<NuxtLink to="/statistieken/landen" class="inline-flex items-center mb-4 text-sm font-medium text-blue-600 hover:underline">
					Meer details
					<icon name="akar-icons:arrow-right" class="w-4 h-4 ml-1" />
				</NuxtLink>

				<div class="pt-3">
					<UtilsAnalyticsCardsViewer name="countries" :visable="3" :data="store.metrics?.countries.values || []" :isSmall="true" :isOpen="true" />
				</div>
			</article>
		</section>
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Dashboard",
		description: "Bekijk een overzicht van de algemene statistieken van je website, inclusief bezoekers, weergaven en bezoekduur.",
		ogTitle: "Insights - Dashboard",
		ogDescription: "Bekijk een overzicht van de algemene statistieken van je website, inclusief bezoekers, weergaven en bezoekduur.",
		ogUrl: "/",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Dashboard",
		twitterDescription: "Bekijk een overzicht van de algemene statistieken van je website, inclusief bezoekers, weergaven en bezoekduur.",
		twitterImage: "/icons/icon_512-blue.png",
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
				href: "/icons/icon_512-blue.png",
			},
		],
	});

	const store = useAnalytics();
</script>

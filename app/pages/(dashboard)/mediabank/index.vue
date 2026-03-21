<template>
	<div class="pb-[5.5rem] md:pb-0">
		<UtilsStorageCardSkeleton v-if="store.loading" />

		<div v-else-if="Object.keys(store.files).length > 0" class="space-y-3">
			<ClientOnly>
				<UtilsStorageCount :count="Number(store.count)" />
				<UtilsStorageCardGroup v-for="(grouped, articleTitle) in store.files" :key="articleTitle" :files="grouped" :articleTitle="articleTitle" />
				<template #fallback>
					<UtilsStorageCardSkeleton />
				</template>
			</ClientOnly>
		</div>
		<UtilsStorageError v-else />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Mediabank",
		description: "Overzicht van opslag en bestanden.",
		ogTitle: "Insights - Mediabank",
		ogDescription: "Overzicht van opslag en bestanden.",
		ogUrl: "/mediabank",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Mediabank",
		twitterDescription: "Overzicht van opslag en bestanden.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "summary",
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

	const store = useStorage();
</script>

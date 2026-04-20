<template>
	<div class="grid flex-1 grid-cols-1 overflow-hidden h-[74dvh] md:h-[74dvh] md:grid-cols-2">
		<div class="z-10 md:pr-4 md:border-r">
			<div ref="el" class="flex-1 h-[73.8dvh] md:h-[73.8dvh] overflow-y-auto">
				<UtilsEmailsCardSkeleton v-if="store.loading" />
				<template v-else>
					<UtilsDisplayError label="berichten" IconName="akar-icons:inbox" v-if="store.messages.length === 0" />
					<ClientOnly v-else>
						<UtilsEmailsCard />
						<UtilsEmailsCardSkeleton v-if="isLoading" />
						<template #fallback>
							<UtilsEmailsCardSkeleton />
						</template>
					</ClientOnly>
				</template>
			</div>
		</div>
		<UtilsEmailsPreview />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Berichten",
		description: "Bekijk en beheer al je berichten, e-mails en notificaties op één plek.",
		ogTitle: "Insights - Berichten",
		ogDescription: "Bekijk en beheer al je berichten, e-mails en notificaties op één plek.",
		ogUrl: "/berichten",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Berichten",
		twitterDescription: "Bekijk en beheer al je berichten, e-mails en notificaties op één plek.",
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

	// ***************************************************************************

	const store = useNotifications();
	const el = useTemplateRef("el");

	const { isLoading } = useInfiniteScroll(el, () => store.nextPage(), {
		canLoadMore: () => {
			const currentPage = store.pagination.page;
			const totalPages = store.pagination.total;
			const loading = store.loading;

			return !loading && currentPage < totalPages;
		},
	});
</script>

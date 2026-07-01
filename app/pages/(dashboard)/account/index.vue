<template>
	<div>
		<section class="relative grid grid-cols-1 gap-3 md:grid-cols-3">
			<article class="z-10 flex items-center w-full col-span-2 gap-2 p-2 border rounded-lg bg-gray-50 md:gap-3 md:p-3">
				<div class="flex items-center justify-center p-2 text-white bg-blue-600 rounded-lg shrink-0 md:p-3">
					<icon name="akar-icons:people-multiple" class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
				</div>
				<div class="flex-1 min-w-0">
					<h2 class="text-xs font-semibold text-gray-600 truncate md:text-sm">Gebruikersnaam</h2>
					<div class="flex items-center justify-between gap-2">
						<h3 class="text-base font-extrabold text-gray-900 truncate md:text-xl">
							{{ store.user.email }}
						</h3>
					</div>
				</div>
			</article>

			<article class="z-10 flex items-center w-full gap-2 p-2 border rounded-lg bg-gray-50 md:gap-3 md:p-3">
				<div class="flex items-center justify-center p-2 text-white bg-blue-600 rounded-lg shrink-0 md:p-3">
					<icon name="akar-icons:shield" class="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
				</div>
				<div class="flex-1 min-w-0">
					<h2 class="text-xs font-semibold text-gray-600 truncate md:text-sm">Tweefactorauthenticatie</h2>

					<div class="flex items-center justify-between gap-2">
						<button @click="account.disableProtection" v-if="store.user.factors?.enabled" class="text-base font-extrabold text-gray-900 truncate md:text-xl">Ingeschakeld</button>
						<button @click="account.enableProtection" v-else class="text-base font-extrabold text-gray-900 truncate md:text-xl">Uitgeschakeld</button>
					</div>
				</div>
			</article>
		</section>

		<UtilsAccountViewerSessions :sessions="account.sessions || []" />

		<UtilsAccountViewerTokens :data="tokenData" />
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Account",
		description: "Bekijk en beheer je accountgegevens, beveiligingsinstellingen en actieve sessies.",
		ogTitle: "Insights - Account",
		ogDescription: "Bekijk en beheer je accountgegevens, beveiligingsinstellingen en actieve sessies.",
		ogUrl: "/profile",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Account",
		twitterDescription: "Bekijk en beheer je accountgegevens, beveiligingsinstellingen en actieve sessies.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "summary_large_image",
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

	const store = useSessions();
	const account = useAccount();
	const security = useSecurity();

	const tokenData = computed(() => {
		return security.tokens && !Array.isArray(security.tokens)
			? security.tokens
			: {
					values: [],
					categories: [],
				};
	});
</script>

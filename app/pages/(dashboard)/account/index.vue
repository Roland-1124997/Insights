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

		<section class="grid w-full grid-cols-1 mt-3 gap-y-3 md:gap-3 md:grid-cols-2 h-fit pb-[5.5rem] md:pb-0">
			<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
				<div class="flex items-center justify-between mb-4">
					<div>
						<h2 class="text-xl font-bold text-gray-900">Actieve Sessies</h2>
						<p class="mt-1 text-sm text-gray-600">
							{{ account.sessions?.length || 0 }} actieve
							{{ account.sessions?.length === 1 ? "sessie" : "sessies" }}
						</p>
					</div>
				</div>

				<div v-if="account.sessions && account.sessions.length" class="grid gap-3 md:grid-cols-2">
					<div v-for="(session, index) in account.sessions" :key="session.id" class="relative pt-5 bg-white border-t md:border md:p-5 md:rounded-xl">
						<div class="flex items-start justify-between mb-4">
							<div class="flex items-start gap-3">
								<div>
									<div class="flex items-center gap-2 mb-1">
										<h3 class="text-lg font-bold text-gray-900">
											{{ account.getLocationString(session) }}
										</h3>
									</div>

									<div class="flex flex-wrap items-center gap-2 select-none">
										<button
											v-if="!store.isCurrentSession(session.id)"
											@click="account.Delete(session.id)"
											class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full outline-none focus:outline-none focus:ring-2 focus:ring-red-300"
											aria-label="Verwijder sessie">
											<icon name="akar-icons:circle-fill" class="w-2 h-2 mr-1.5" />
											Sessie verwijderen
										</button>
										<span v-if="store.isCurrentSession(session.id)" class="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
											<icon name="akar-icons:circle-fill" class="w-2 h-2 mr-1.5" />
											Huidige sessie
										</span>
										<span v-if="session.timezone" class="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
											<icon name="akar-icons:clock" class="w-3 h-3 mr-1" />
											{{ session.timezone }}
										</span>
										<span v-if="session.screen" class="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
											<icon name="akar-icons:devices" class="w-3 h-3 mr-1" />
											{{ account.deviceType(session.screen) }}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div class="grid grid-cols-1 gap-4 pt-4 border-t border-gray-200 md:grid-cols-2">
							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:network" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">IP Adres</p>
									<p class="text-sm font-semibold text-gray-900">
										{{ session.ip_address || "Onbekend" }}
									</p>
								</div>
							</div>

							<div class="items-start hidden gap-3 md:flex">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:door" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Ingelogd op</p>
									<p class="text-sm font-semibold text-gray-900">
										<NuxtTime :datetime="session.created_at" :relative="true" locale="nl-NL" />
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:home-alt1" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Regio</p>
									<p class="text-sm font-semibold text-gray-900">
										{{ account.getRegionName(session.region_code) }}
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3 md:hidden">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:location" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Locatie</p>
									<p class="text-sm font-semibold text-gray-900">
										{{ useCounryName(session.country_code) }}
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3 md:hidden">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:door" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Ingelogd op</p>
									<p class="text-sm font-semibold text-gray-900">
										<NuxtTime :datetime="session.created_at" :relative="true" locale="nl-NL" />
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:clock" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Laatste activiteit</p>
									<p class="text-sm font-semibold text-gray-900">
										<NuxtTime :datetime="session.updated_at" :relative="true" locale="nl-NL" />
									</p>
								</div>
							</div>

							<div class="items-start hidden gap-3 md:flex">
								<div class="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg shrink-0">
									<icon name="akar-icons:location" class="w-4 h-4 text-blue-600" />
								</div>
								<div class="flex-1 min-w-0">
									<p class="text-xs font-medium tracking-wide text-gray-500 uppercase">Locatie</p>
									<p class="text-sm font-semibold text-gray-900">
										{{ useCounryName(session.country_code) }}
									</p>
								</div>
							</div>
						</div>

						<div class="flex flex-wrap items-center justify-between gap-2 pt-4 mt-4 text-xs text-gray-500 border-t border-gray-200">
							<span class="flex items-center gap-1">
								<icon name="akar-icons:key" class="w-3.5 h-3.5" />
								<span class="font-mono">{{ session.id.substring(0, 8) }}...</span>
							</span>
						</div>
					</div>
				</div>

				<div v-else class="p-12 text-center text-gray-500">
					<div class="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
						<icon name="akar-icons:laptop-device" class="w-8 h-8 text-gray-400" />
					</div>
					<p class="text-lg font-medium">Geen actieve sessies gevonden</p>
					<p class="mt-1 text-sm">Log opnieuw in om een sessie te starten</p>
				</div>
			</article>
		</section>
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
</script>

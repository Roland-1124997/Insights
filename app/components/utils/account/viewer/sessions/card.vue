<template>
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
</template>

<script setup lang="ts">
	defineProps({
		session: {
			type: Object as PropType<UserSession>,
			required: true,
		},
	});

	const store = useSessions();
	const account = useAccount();
</script>

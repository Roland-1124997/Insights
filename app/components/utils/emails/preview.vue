<template>
	<div v-if="store.selected" class="z-10 flex-col hidden overflow-hidden bg-white md:flex">
		<header class="flex-shrink-0 py-2 pb-3 bg-white border-b border-gray-200 md:p-4">
			<div class="z-40 items-center hidden gap-2 md:flex">
				<button
					@click="store.compose(store.selected)"
					class="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-500 rounded-lg w-fit hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
					aria-label="Beantwoord dit bericht">
					<span>Beantwoorden</span>
				</button>
				<button
					@click="toggleCollapse"
					class="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg w-[8.2rem] hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
					:aria-label="collapsed ? 'Klap bericht uit' : 'Klap bericht in'"
					:aria-expanded="!collapsed">
					<span>{{ collapsed ? "Uitklappen" : "Inklappen" }}</span>

					<icon :name="collapsed ? 'ri:arrow-up-s-fill' : 'ri:arrow-down-s-fill'" aria-hidden="true" class="object-cover w-6 h-6" />
				</button>
			</div>
			<div v-if="!collapsed" class="pt-2 space-y-3 border-t md:mt-4">
				<h1 id="message-subject" class="text-xl font-bold leading-tight text-gray-900 line-clamp-1 text-balance md:text-2xl">
					{{ store.selected.subject || "(Geen onderwerp)" }}
				</h1>

				<div class="flex flex-col gap-1 text-sm text-gray-600">
					<div class="flex items-center">
						<span class="min-w-0 mr-2 font-medium">Van:</span>
						<a
							:href="`mailto:${store.selected.from.address}`"
							class="text-[#1d4ed8] text-lg underline truncate hover:text-[#1e40af] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
							:aria-label="`E-mail ${store.selected.from.address || 'Onbekende afzender'}`">
							{{ store.selected.from.address || "Onbekende afzender" }}
						</a>
					</div>
					<div class="flex items-center">
						<span class="min-w-0 mr-2 font-medium">Datum:</span>
						<NuxtTime :datetime="store.selected.date" weekday="long" year="numeric" month="short" day="2-digit" hour="2-digit" minute="2-digit" class="text-gray-700" />
					</div>
				</div>
			</div>
		</header>

		<div class="flex-1 py-2 overflow-y-auto md:p-4" aria-label="Bericht inhoud">
			<article class="prose text-gray-800 max-w-none">
				<div class="text-balance">
					<div :class="!collapsed ? ' h-[46vh]' : ' h-[60vh]'" class="w-full overflow-hidden rounded">
						<iframe :srcdoc="store.selected.html" sandbox="allow-popups allow-popups-to-escape-sandbox" :title="store.selected.subject" class="w-full h-full"></iframe>
					</div>
				</div>
			</article>
		</div>
	</div>

	<div v-else class="z-10 items-center justify-center hidden rounded-r-lg md:flex bg-gray-50">
		<div class="max-w-sm text-center">
			<icon name="akar-icons:envelope" class="w-20 h-20 mx-auto mb-4 text-gray-300" aria-hidden="true" />
			<h2 class="mb-2 text-xl font-medium text-gray-700">Selecteer een bericht</h2>
			<p class="text-sm leading-relaxed text-gray-500">Om de volledige inhoud te bekijken</p>
		</div>
	</div>
</template>

<script setup lang="ts">
	const store = useNotifications();
	store.openMessageById((store.activeMessageId as string) || "");

	const collapsed = ref(false);
	const toggleCollapse = () => (collapsed.value = !collapsed.value);
</script>

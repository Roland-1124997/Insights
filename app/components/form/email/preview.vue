<template>
	<div>
		<header class="flex-shrink-0">
			<div class="z-40 flex items-center gap-2 -mt-3">
				<button
					@click="props.onConfirm(props.message)"
					class="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
					aria-label="Beantwoord dit bericht">
					<span>Beantwoorden</span>
				</button>
				<button
					@click="toggleCollapse"
					class="flex items-center justify-center w-40 gap-2 px-3 py-[0.40rem] text-sm font-medium text-gray-700 transition-colors duration-200 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
					:aria-label="collapsed ? 'Klap bericht uit' : 'Klap bericht in'"
					:aria-expanded="!collapsed">
					<span class="w-[4.5rem]">{{ collapsed ? "Uitklappen" : "Inklappen" }}</span>
					<icon :name="collapsed ? 'ri:arrow-up-s-fill' : 'ri:arrow-down-s-fill'" aria-hidden="true" class="object-cover w-6 h-6" />
				</button>
			</div>
			<div v-if="!collapsed" class="pt-1 mt-4 space-y-3 bg-white border-t border-gray-200 md:mt-2">
				<div class="flex flex-col gap-1 text-sm text-gray-600">
					<div class="flex items-center">
						<span class="min-w-0 mr-2 font-medium">Van:</span>
						<a
							:href="`mailto:${props.message.from.address}`"
							class="text-[#1d4ed8] text-lg underline truncate hover:text-[#1e40af] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
							:aria-label="`E-mail ${props.message.from.address || 'Onbekende afzender'}`">
							{{ props.message.from.address || "Onbekende afzender" }}
						</a>
					</div>
					<div class="flex items-center">
						<span class="min-w-0 mr-2 font-medium">Datum:</span>
						<NuxtTime :datetime="props.message.date" weekday="long" year="numeric" month="short" day="2-digit" hour="2-digit" minute="2-digit" class="text-gray-700" />
					</div>
				</div>
			</div>
		</header>

		<div class="flex-1 py-2 pt-3 pb-4 mt-4 overflow-y-auto border-t border-gray-200 md:p-4" aria-label="Bericht inhoud">
			<article class="prose text-gray-800 max-w-none">
				<div :class="!collapsed ? ' h-[58vh]' : ' h-[66.6vh]'">
					<iframe :srcdoc="props.message.html" sandbox="" :title="props.message.html" class="w-full h-full"></iframe>
				</div>
			</article>
		</div>
	</div>
</template>

<script lang="ts" setup>
	defineProps<{
		props: Record<string, any>;
	}>();

	const collapsed = ref(false);
	const toggleCollapse = () => (collapsed.value = !collapsed.value);
</script>

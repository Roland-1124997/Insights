<template>
	<div>
		<header class="flex-shrink-0 py-2 pb-3 bg-white border-b border-gray-200 md:p-4">
			<div class="z-40 flex items-center gap-2 pb-3 mb-2 -mt-3 border-b">
				<button @click="props.onConfirm(props.message)" class="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-500 rounded-lg hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Beantwoord dit bericht">
					<span>Beantwoorden</span>
				</button>
			</div>
			<div class="space-y-3 md:mt-2">
				
				<div class="flex flex-col gap-1 text-sm text-gray-600">
					<div class="flex items-center">
						<span class="min-w-0 mr-2 font-medium">Van:</span>
						<a :href="`mailto:${props.message.from.address}`" class="text-[#1d4ed8] text-lg underline truncate hover:text-[#1e40af] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" :aria-label="`E-mail ${props.message.from.address || 'Onbekende afzender'}`">
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

		<div class="flex-1 py-2 overflow-y-auto max-h-[50vh] pb-4 md:p-4" aria-label="Bericht inhoud">
			<article class="prose text-gray-800 max-w-none">
				<div class="text-balance">
					<iframe :srcdoc="props.message.html" sandbox="" :title="props.message.html" class="w-full h-[46vh]"></iframe>
				</div>
			</article>
		</div>
	</div>
</template>

<script lang="ts" setup>

	defineProps<{
		props: Record<string, any>;
	}>();
</script>

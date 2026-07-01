<template>
	<div class="space-y-4">
		<div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
			<h2 class="mb-1 text-sm font-semibold text-gray-700">Toegangssleutel</h2>
			<p class="text-xs leading-5 text-gray-600">
				Voeg deze header toe aan je API-aanroep. Gebruik het formaat <span class="font-mono text-gray-800">x-access-token: &lt;token&gt;</span> en plak daarna de toegangssleutel in je client of tool.
			</p>

			<div class="p-3 mt-4 mb-4 bg-white border border-gray-300 border-dashed rounded-md">
				<p class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Voorbeeld</p>

				<pre class="overflow-x-auto text-xs leading-5 text-gray-700"><code>{{ exampleHeader }}</code></pre>
			</div>

			<button
				@click="copyToClipboard(exampleHeader)"
				class="flex items-center justify-center w-full gap-2.5 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 border-blue-600 rounded-xl outline-none select-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
				<icon name="akar-icons:copy" class="w-5 h-5" aria-hidden="true" />
				<span> Kopieer naar klembord </span>
			</button>
		</div>
	</div>
</template>

<script lang="ts" setup>
	const { props } = defineProps<{
		props: Record<string, any>;
	}>();

	const exampleHeader = computed(() => {
		return `"x-access-token": "${props.content.sleutel}"`;
	});
</script>

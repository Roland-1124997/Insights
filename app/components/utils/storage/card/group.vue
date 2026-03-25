<template>
	<div class="flex select-none items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg w-fit">
		<icon name="akar-icons:folder" size="0.875rem" class="text-gray-500" />
		<span class="text-xs font-semibold text-gray-600">
			{{ articleTitle === "null" ? "Niet gekoppeld" : `${articleTitle}` }}
		</span>
		<span class="text-xs text-gray-400">•</span>
		<span class="text-xs text-gray-500">{{ files.length }} {{ files.length === 1 ? "bestand" : "bestanden" }}</span>
	</div>

	<div class="grid gap-3 md:grid-cols-2">
		<div
			v-for="(file, index) in files"
			:key="index"
			class="z-10 flex items-center w-full gap-3 p-3 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50 group hover:border-gray-300">
			<UtilsStorageCard :file />
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		files: {
			type: Array as () => FileData[],
			required: true,
		},
		articleTitle: {
			type: String,
			required: true,
		},
	});
</script>

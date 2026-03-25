<template>
	<div class="flex-shrink-0">
		<div class="flex items-center justify-center w-12 h-12 rounded-lg" :style="{ background: file.metadata.icon.background }">
			<icon name="akar-icons:file" size="1.45rem" :style="{ color: file.metadata.icon.color }" />
		</div>
	</div>

	<div class="flex items-start justify-between w-full gap-3">
		<div class="flex-1 overflow-hidden">
			<p class="text-sm font-medium text-gray-900 truncate max-w-40 md:max-w-60" :title="file.name">
				{{ file.name.charAt(0).toUpperCase() + file.name.slice(1).split(".")[0] }}
			</p>
			<div class="flex items-center gap-1 text-[0.73rem] md:text-sm -mt-[0.10rem]">
				<span :style="{ color: file.metadata.icon.color }" class="font-semibold">{{ file.metadata.label }}</span>
				<span aria-hidden class="text-gray-500">•</span>
				<span class="text-gray-500">{{ file.metadata.size }}</span>
			</div>
			<div class="flex items-center gap-2 text-xs text-gray-500 capitalize">
				<NuxtTime locale="nl" weekday="long" year="numeric" month="short" day="2-digit" hour="2-digit" minute="2-digit" :datetime="file.metadata.updated_at" />
			</div>
		</div>

		<div class="flex flex-shrink-0 select-none gap-x-1">
			<button
				@click="store.preview(file)"
				class="flex items-center justify-center transition-colors w-6 h-6 bg-gray-100 rounded-lg group-hover:bg-gray-200 hover:text-white hover:!bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
				title="Bekijk voorbeeld van bestand"
				aria-label="Bekijk voorbeeld van bestand">
				<icon name="akar-icons:eye" class="w-[0.85rem] h-[0.85rem]" aria-hidden="true" />
			</button>
			<button
				:aria-label="file.published ? 'Bestand is zichtbaar' : 'Bestand is zichtbaar'"
				@click="store.patch(file)"
				class="flex items-center justify-center w-6 h-6 transition-colors bg-gray-100 rounded-lg group-hover:bg-gray-200 hover:text-white hover:!bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300"
				:title="file.published ? 'Bestand is zichtbaar' : 'Bestand is verborgen'">
				<icon :name="file.published ? 'akar-icons:circle-check' : 'akar-icons:circle-x'" class="w-[0.85rem] h-[0.85rem]" aria-hidden="true" />
			</button>
			<button
				aria-label="Bestand verwijderen"
				@click="store.remove(file)"
				class="flex items-center justify-center w-6 h-6 transition-colors bg-gray-100 rounded-lg group-hover:bg-gray-200 hover:text-white hover:!bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
				title="Bestand verwijderen">
				<icon name="akar-icons:circle-minus" class="w-[0.85rem] h-[0.85rem]" aria-hidden="true" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
	const store = useStorage();

	defineProps({
		file: {
			type: Object as () => FileData,
			required: true,
		},
	});
</script>

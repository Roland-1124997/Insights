<template>
	<tr class="transition-all hover:bg-gray-50 group">
		<th v-if="name == 'pages'" scope="row" class="flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-left text-gray-900 whitespace-nowrap">
			<div class="flex items-center gap-3">
				<icon name="ri:global-line" aria-hidden="true" class="object-cover w-6 h-6 mr-2 text-blue-600 rounded-sm opacity-50 group-hover:opacity-100" />
				{{ data.label }}
			</div>

			<button
				type="button"
				@click="toggleExpanded"
				:aria-expanded="expanded"
				:aria-controls="getDetailsRowId(data.label)"
				:aria-label="getToggleButtonLabel(data.label)"
				:class="isSmall ? '' : 'md:hidden'"
				class="flex items-center justify-center p-1 rounded-sm opacity-70 group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
				<icon :name="expanded ? 'ri:arrow-up-s-fill' : 'ri:arrow-down-s-fill'" aria-hidden="true" class="object-cover w-6 h-6" />
			</button>
		</th>

		<th v-else-if="name == 'devices'" scope="row" class="flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-left text-gray-900 whitespace-nowrap">
			<div class="flex items-center gap-3">
				<icon :name="`akar-icons:${data.label.toLowerCase()}-device`" aria-hidden="true" class="object-cover w-6 h-6 mr-2 text-blue-600 rounded-sm opacity-50 group-hover:opacity-100" />
				{{ data.label }}
			</div>

			<button
				type="button"
				@click="toggleExpanded"
				:aria-expanded="expanded"
				:aria-controls="getDetailsRowId(data.label)"
				:aria-label="getToggleButtonLabel(data.label)"
				:class="isSmall ? '' : 'md:hidden'"
				class="flex items-center justify-center p-1 rounded-sm opacity-70 group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
				<icon :name="expanded ? 'ri:arrow-up-s-fill' : 'ri:arrow-down-s-fill'" aria-hidden="true" class="object-cover w-6 h-6" />
			</button>
		</th>

		<th v-else-if="name == 'countries'" scope="row" class="flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-left text-gray-900 whitespace-nowrap">
			<div class="flex items-center gap-3">
				<icon
					:name="`twemoji:flag-${useCounryName(data.label, 'en').replace(' ', '-').toLowerCase()}`"
					aria-hidden="true"
					class="object-cover w-6 h-6 mr-2 rounded-sm opacity-70 group-hover:opacity-100" />
				{{ useCounryName(data.label) }}
			</div>

			<button
				type="button"
				@click="toggleExpanded"
				:aria-expanded="expanded"
				:aria-controls="getDetailsRowId(data.label)"
				:aria-label="getToggleButtonLabel(data.label)"
				:class="isSmall ? '' : 'md:hidden'"
				class="flex items-center justify-center p-1 rounded-sm opacity-70 group-hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
				<icon :name="expanded ? 'ri:arrow-up-s-fill' : 'ri:arrow-down-s-fill'" aria-hidden="true" class="object-cover w-6 h-6" />
			</button>
		</th>

		<td
			v-for="category in categories.slice(1, categories.length)"
			:key="category.value"
			class="py-3 text-sm text-center text-gray-700 border-t border-l first:border-l-0 whitespace-nowrap"
			:class="decorator(category.value)">
			{{ formatCategoryValue(data, category.value) }}
		</td>
	</tr>

	<tr v-if="expanded" :class="isSmall ? '' : 'md:hidden'">
		<td :id="getDetailsRowId(data.label)" :colspan="categories.length" class="text-xs text-gray-600" role="region" :aria-label="`Details voor ${data.label}`">
			<table class="min-w-full">
				<caption class="sr-only">
					Details voor
					{{
						data.label
					}}
				</caption>
				<thead class="">
					<tr>
						<th
							v-for="category in categories.slice(1, categories.length - 2)"
							:key="category.value"
							scope="col"
							class="py-3 text-[0.65rem] font-medium tracking-wider text-center text-gray-700 uppercase">
							{{ category.label }}
						</th>
					</tr>
				</thead>

				<tbody class="">
					<tr class="">
						<td
							v-for="category in categories.slice(1, categories.length - 2)"
							:key="category.value"
							class="py-3 text-sm text-center text-gray-700 border-t border-l first:border-l-0 whitespace-nowrap">
							{{ formatCategoryValue(data, category.value) }}
						</td>
					</tr>
				</tbody>
			</table>
		</td>
	</tr>
</template>

<script setup lang="ts">
	const { isOpen } = defineProps({
		isSmall: {
			type: Boolean,
			default: false,
		},
		isOpen: {
			type: Boolean,
			default: false,
		},
		name: {
			type: String as PropType<"pages" | "countries" | "devices">,
			required: true,
		},
		data: {
			type: Object as PropType<{
				label: string;
				weergaven: number;
				bezoekers: number;
				bezoeken: number;
				bounces: number;
				totaltime: number;
			}>,
			required: true,
		},
		categories: {
			type: Array<{ label: string; value: string }>,
			default: () => [],
		},
		decorator: {
			type: Function as PropType<(value: string) => string>,
			required: true,
		},
	});

	const expanded = ref<boolean>(isOpen || false);

	const getDetailsRowId = (label: string) => `row-details-${label.toLowerCase()}`;
	const getToggleButtonLabel = (label: string) => `${expanded.value ? "Verberg" : "Toon"} details voor ${label}`;
	const toggleExpanded = () => (expanded.value = !expanded.value);

	const formatCategoryValue = (data: any, category: string) => {
		if (category === "bounces") return `${useFormatDuration(data[category])}%`;
		if (category === "totaltime") return useFormatDuration(data[category], true);
		return useFormatDuration(data[category]);
	};
</script>

<template>
	<div class="overflow-x-auto bg-white border border-gray-200 rounded-lg">
		<table class="min-w-full divide-y divide-gray-200">
			<thead class="bg-gray-50">
				<tr>
					<th class="px-4 py-3 text-sm font-medium tracking-wider text-left text-gray-700 uppercase">
						{{ categories[0]?.label }}
					</th>
					<th
						v-for="category in categories.slice(1, categories.length)"
						:key="category.value"
						class="py-3 text-sm font-medium tracking-wider text-center text-gray-700 uppercase"
						:class="decorator(category.value)">
						{{ category.label }}
					</th>
				</tr>
			</thead>
			<tbody v-if="data.length >= 1 && !loading" class="bg-white divide-y divide-gray-200">
				<ClientOnly>
					<UtilsTableRow v-for="meta in data" :key="meta.label" :data="meta" :categories :name :decorator="decorator" :isSmall :isOpen />

					<template #fallback>
						<UtilsTableRowSkeleton v-for="i in visable" :key="i" :categories :decorator="decorator" :isSmall :isOpen />
					</template>
				</ClientOnly>
			</tbody>
			<tbody v-else class="bg-white">
				<UtilsTableRowSkeleton v-for="i in visable" :key="i" :categories :decorator="decorator" :isSmall :isOpen />
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
	const props = defineProps({
		loading: {
			type: Boolean,
			default: false,
		},
		visable: {
			type: Number,
			default: 10,
		},
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
			type: Array<{
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
	});

	const decorator = (value: string) => {
		if (props.isSmall) return "hidden";

		const classes: Record<string, string> = {
			weergaven: "hidden md:table-cell",
			bezoekers: "hidden sm:table-cell",
			bezoeken: "hidden md:table-cell",
			bounces: "hidden md:table-cell",
			totaltime: "hidden md:table-cell",
		};
		return classes[value] || "";
	};
</script>

<template>
	<tr class="border-y">
		<th scope="row" :class="isOpen ? 'py-[0.998rem]' : 'py-[0.998rem] md:py-3'" class="flex items-center justify-between gap-3 px-4 text-sm font-medium text-left text-gray-900 whitespace-nowrap">
			<div class="flex items-center w-full gap-3">
				<div class="w-6 h-6 bg-gray-200 rounded-sm animate-pulse"></div>
				<div class="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
			</div>

			<div :class="isSmall ? '' : 'md:hidden'" class="flex-shrink-0 w-5 h-5 bg-gray-200 rounded-sm animate-pulse"></div>
		</th>

		<td
			v-for="category in categories.slice(1, categories.length)"
			:key="category.value"
			class="py-3 text-sm text-center text-gray-700 border-t border-l first:border-l-0 whitespace-nowrap"
			:class="decorator(category.value)">
			<div class="w-1/2 ml-[25%] h-4 bg-gray-200 rounded animate-pulse"></div>
		</td>
	</tr>

	<tr v-if="isOpen" :class="isSmall ? '' : 'md:hidden'">
		<td :colspan="categories.length" class="text-xs text-gray-600" role="region">
			<table class="min-w-full">
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
							:class="isOpen ? 'py-[0.86rem]' : 'py-[0.86rem] md:py-3'"
							class="text-sm text-center text-gray-700 border-t border-l first:border-l-0 whitespace-nowrap">
							<div class="w-3/4 ml-[15%] h-4 bg-gray-200 rounded animate-pulse"></div>
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
		categories: {
			type: Array<{ label: string; value: string }>,
			default: () => [],
		},
		decorator: {
			type: Function as PropType<(value: string) => string>,
			required: true,
		},
	});
</script>

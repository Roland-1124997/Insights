<template>
	<button
		v-if="isButton"
		:disabled="loading"
		:class="padding"
		class="flex items-center justify-center gap-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-500 rounded-lg outline-none select-none disabled:cursor-not-allowed disabled:opacity-60 w-fit hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
		:aria-label="description">
		<icon :name="iconName" :class="loading ? ' animate-spin' : ''" class="w-5 h-5" aria-hidden="true" />
		<span class="sr-only"> {{ description }} </span>
	</button>

	<NuxtLink
		role="button"
		v-else
		:to
		:class="padding"
		class="flex items-center select-none justify-center gap-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-500 rounded-lg outline-none w-fit hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
		:aria-label="description">
		<icon :name="iconName" class="w-5 h-5" aria-hidden="true" />
		<span class="sr-only"> {{ description }} </span>
	</NuxtLink>
</template>

<script setup lang="ts">
	const { isSmall } = defineProps({
		to: { type: String, required: false },
		iconName: { type: String, default: "arrow-left" },
		description: { type: String, default: "" },
		isButton: { type: Boolean, default: false },
		isSmall: { type: Boolean, default: false },
		loading: { type: Boolean, default: false },
	});

	const padding = isSmall ? "p-[0.50rem]" : "p-[0.60rem]";
</script>

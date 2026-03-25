<template>
	<button
		:disabled="loading || activeType == type"
		type="button"
		@click="setFilter(type)"
		:class="[
			'flex items-center justify-center gap-2 px-4 select-none text-sm font-medium transition-colors duration-200 border rounded-lg outline-none disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2',
			large ? 'w-full' : 'w-fit',
			alwaysShowLabel ? 'py-2' : 'py-[0.68rem] md:py-2',
			getColorClasses(color, filter === type),
		]"
		:aria-label="label"
		:aria-pressed="filter === type">
		<Icon v-if="loading && activeType == type" name="akar-icons:arrow-cycle" class="w-4 h-4 animate-spin" aria-hidden="true" />
		<Icon v-else :name="iconName" class="w-4 h-4" aria-hidden="true" />

		<span :class="alwaysShowLabel ? 'flex' : 'hidden md:flex'">
			<span class="hidden md:inline">{{ label }}</span>
			<span class="md:hidden">{{ shortLabel }}</span>
		</span>
	</button>
</template>

<script setup lang="ts">
	defineProps<{
		filter: string | null;
		setFilter: (filter: string) => void;
		type: string;
		iconName: string;
		label: string;
		shortLabel: string;
		alwaysShowLabel: boolean;
		color: string;
		large: boolean;
		loading: boolean;
		activeType: string | null;
	}>();

	const getColorClasses = (color: string, isActive: boolean) => {
		const colors: Record<string, { active: string; inactive: string }> = {
			neutral: {
				active: "bg-neutral-100 text-neutral-800 border-neutral-400 focus:ring-neutral-400",
				inactive: "text-gray-700 bg-white border-gray-300 hover:bg-neutral-50 hover:text-neutral-600 focus:text-neutral-600 focus:border-neutral-500 hover:border-neutral-500 focus:ring-neutral-400",
			},
			blue: {
				active: "bg-blue-100 text-blue-800 border-blue-400 focus:ring-blue-300",
				inactive: "text-gray-700 bg-white border-gray-300 hover:bg-blue-50 hover:text-blue-600 focus:text-blue-600 focus:border-blue-500 hover:border-blue-500 focus:ring-blue-300",
			},
			red: {
				active: "bg-red-100 text-red-800 border-red-400 focus:ring-red-300",
				inactive: "text-gray-700 bg-white border-gray-300 hover:bg-red-50 hover:text-red-600 focus:text-red-600 focus:border-red-500 hover:border-red-500 focus:ring-red-300",
			},
		};

		return isActive ? colors[color]?.active : colors[color]?.inactive;
	};
</script>

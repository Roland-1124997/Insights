<template>
	<div class="relative select-none text-sm">
		<button class="flex items-center justify-center gap-2 p-2 border rounded-xl bg-gray-50 hover:bg-gray-100">
			<img v-if="options.url" :src="options.url" :alt="options.name" class="w-5 h-5 font-medium text-gray-500 rounded-full" />
			<icon v-else :name="iconName" class="text-gray-400" size="1.2rem" />
			<span v-if="options.name" :class="[options.hidden ? 'sr-only' : options.always ? 'flex' : 'hidden md:flex', 'font-medium text-gray-600']">
				{{ options.name }}
			</span>
		</button>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		iconName: { type: String, default: "arrow-left" },
		options: {
			type: Object,
			default: () => ({
				count: undefined,
				name: undefined,
				url: undefined,
				always: true,
				hidden: false,
			}),
		},
	});
</script>

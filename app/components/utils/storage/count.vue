<template>
	<div class="sticky top-0 z-20 flex items-center justify-between px-4 py-2 mb-3 text-blue-800 border border-blue-200 rounded-lg select-none bg-blue-50 w-fit md:px-4">
		<h2 class="text-sm font-bold">{{ count }} {{ count === 1 ? "document" : "documenten" }}</h2>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		count: {
			type: Number as () => number,
			required: true,
		},
	});
</script>

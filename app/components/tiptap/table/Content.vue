<template>
	<li>
		<button
			@click="onItemClick(node)"
			:data-item-index="node.itemIndex"
			class="flex items-start w-full gap-1 p-1 text-sm font-semibold text-gray-500 rounded hover:bg-gray-100 hover:text-gray-700"
			:class="[{ 'text-gray-700 bg-gray-100': active }]"
			:style="paddingStyle">
			<span>{{ node.level }}.</span>
			<span class="truncate">{{ node.textContent }}</span>
		</button>

		<ul v-if="node.children && node.children.length" class="mt-1 space-y-1">
			<TiptapTableContent :active-id="activeId" :on-item-click="onItemClick" v-for="child in node.children" :key="child.id" :node="child" />
		</ul>
	</li>
</template>

<script setup lang="ts">
	defineOptions({ name: "TocItem" });

	const { node, activeId } = defineProps<{
		node: any;
		activeId: string | null;
		onItemClick: (node: any) => void;
	}>();

	const paddingStyle = computed(() => {
		const level = node.level ? Math.max(0.5, node.level - 1) : 0;
		const rem = level * 0.75;
		return { paddingLeft: `${rem}rem` };
	});

	const active = computed(() => {
		return node.id == activeId;
	});
</script>

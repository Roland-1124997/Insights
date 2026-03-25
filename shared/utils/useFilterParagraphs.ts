import { computed } from "vue";

export const useFilterParagraphs = (initialNodes: Record<string, any>, wanted_node_type: string) => {
	const filtered = computed(() => {
		return initialNodes.filter((node: { type: string; content: any[] }) => {
			if (wanted_node_type === "paragraph") {
				const isParagraph = node.type === "paragraph";
				const isTextContext = node.content && node.content.some((child: any) => child.type === "text");
				const hasMarks = node.content && node.content.some((child: any) => child.marks && child.marks.length > 0);
				return isParagraph && isTextContext && !hasMarks;
			}

			if (wanted_node_type === "image") {
				return node.type === "image";
			}

			return false;
		});
	});

	return {
		filtered,
	};
};

<template>
	<editor-content :editor="editor" />
</template>

<script lang="ts" setup>
	import { EditorContent, type Editor } from "@tiptap/vue-3";

	const { editor } = defineProps<{
		editor: Editor;
	}>();
</script>

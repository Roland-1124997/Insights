<template>
	<div class="select-none">
		<div v-for="(item, index) in list" :key="index">
			<div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`"></div>
			<TiptapMenuList v-else :action="item.action ?? (() => {})" :icon="item.icon || ''" :title="item.title || ''" :key="index" v-bind="item" :editable />
		</div>
	</div>
</template>

<script lang="ts" setup>
	import type { Editor } from "@tiptap/vue-3";

	const { addToast } = useToast();
	const { create, close } = useModal();

	const { editor, hidden } = defineProps<{
		editor: Editor;
		hidden?: Array<string>;
		editable?: boolean;
	}>();

	const list = ref([
		{
			icon: "fluent:text-bold-20-filled",
			title: "Bold",
			action: () => editor.chain().focus().toggleBold().run(),
			isActive: () => editor.isActive("bold"),
		},
		{
			icon: "fluent:text-italic-20-filled",
			title: "Italic",
			action: () => editor.chain().focus().toggleItalic().run(),
			isActive: () => editor.isActive("italic"),
		},
		{
			icon: "fluent:text-strikethrough-20-filled",
			title: "Strike",
			action: () => editor.chain().focus().toggleStrike().run(),
			isActive: () => editor.isActive("strike"),
		},
		{
			icon: "fluent:text-underline-20-filled",
			title: "Underline",
			action: () => editor.chain().focus().toggleUnderline().run(),
			isActive: () => editor.isActive("underline"),
		},
		{
			type: "divider",
		},
		{
			icon: "fluent:text-header-1-20-filled",
			title: "Heading 1",
			action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
			isActive: () => editor.isActive("heading", { level: 1 }),
		},
		{
			icon: "fluent:text-header-2-20-filled",
			title: "Heading 2",
			action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
			isActive: () => editor.isActive("heading", { level: 2 }),
		},
		{
			icon: "fluent:text-header-3-20-filled",
			title: "Heading 3",
			action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
			isActive: () => editor.isActive("heading", { level: 3 }),
		},
		{
			icon: "fluent:text-header-4-20-filled",
			title: "Heading 4",
			action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
			isActive: () => editor.isActive("heading", { level: 4 }),
		},
		{
			icon: "fluent:text-paragraph-direction-20-filled",
			title: "Paragraph",
			action: () => editor.chain().focus().setParagraph().run(),
			isActive: () => editor.isActive("paragraph"),
		},
		{
			type: "divider",
		},
		{
			icon: "fluent:code-block-24-regular",
			title: "Code Block",
			action: () => editor.chain().focus().toggleCodeBlock().run(),
			isActive: () => editor.isActive("codeBlock"),
		},

		{
			icon: "fluent:text-bullet-list-square-sparkle-24-regular",
			title: "Details",
			action: () => {
				const active = editor.isActive("details");
				if (active) return editor.chain().focus().unsetDetails().run();
				return editor.chain().focus().setDetails().run();
			},
			isActive: () => editor.isActive("details"),
		},
		{
			icon: "fluent:image-edit-24-regular",
			title: "Image Meta",
			action: () => {
				const { alt, src, title } = editor.getAttributes("image");

				create({
					name: "Afbeelding metadata bewerken",
					description: "Bewerk de metadata van de afbeelding",
					component: "ImageMeta",
					props: {
						content: {
							src,
							alt,
							title,
						},
						onConfirm: (attrs: { title: string; alt: string }) => {
							const Attrs = { ...attrs, src };
							editor.chain().focus().setImage(Attrs).run();
							close();
						},
					},
				});
			},
			isActive: () => editor.isActive("image"),
			isBlocked: () => !editor.isActive("image"),
		},
		{
			type: "divider",
		},
		{
			icon: "fluent:text-bullet-list-20-filled",
			title: "Bullet List",
			action: () => editor.chain().focus().toggleBulletList().run(),
			isActive: () => editor.isActive("bulletList"),
		},
		{
			icon: "fluent:text-number-list-20-filled",
			title: "Ordered List",
			action: () => editor.chain().focus().toggleOrderedList().run(),
			isActive: () => editor.isActive("orderedList"),
		},
		{
			type: "divider",
		},
		{
			icon: "fluent:highlight-24-regular",
			title: "Highlight",
			action: () => editor.chain().focus().toggleHighlight().run(),
			isActive: () => editor.isActive("highlight"),
		},
		{
			type: "divider",
		},
		{
			icon: "fluent:link-add-20-regular",
			activeIcon: "fluent:link-dismiss-20-regular",
			title: "link",
			action: () => {
				const existingHref = editor.isActive("link") ? editor.getAttributes("link").href : "";

				const onConfirm = (href: string) => {
					if (href) {
						close();
						editor.chain().focus().setLink({ href: href.trim() }).run();
					}
				};

				if (!existingHref)
					create({
						name: "Hyperlink invoegen",
						description: "Voer de URL in om een hyperlink toe te voegen",
						component: "FormInputUrl",
						props: { editor, onConfirm },
					});
				else editor.chain().focus().unsetLink().run();
			},
			isActive: () => editor.isActive("link"),
		},
		{
			icon: "bxl:github",
			title: "Verbind project",
			action: async () => {
				addToast({
					type: "info",
					message: "Ophalen van repositories...",
				});

				const uri = "/api/integrations/github/repositories";
				const request = useApiHandler<ApiResponse<{ name: string; id: string }>>(uri);

				const { data: repositories, error } = await request.Get();

				if (!error && repositories?.data) {
					create({
						name: "Verbind met GitHub",
						description: "Kies een repository om mee te verbinden",
						component: "FormSelect",
						props: { repositories: repositories.data, editor },
					});
				} else
					addToast({
						type: "error",
						message: "er is een fout opgetreden bij het ophalen van repositories",
					});
			},
		},
		{
			type: "divider",
		},
		{
			icon: "fluent:arrow-hook-up-left-20-filled",
			title: "Undo",
			action: () => editor.chain().focus().undo().run(),
		},
		{
			icon: "fluent:arrow-hook-up-right-20-filled",
			title: "Redo",
			action: () => editor.chain().focus().redo().run(),
		},
	]);

	list.value = list.value
		.filter((item) => {
			if (item.type === "divider") return true;
			if (hidden && item.title && hidden.includes(item.title)) return false;
			return true;
		})
		.filter((item, index, self) => {
			if (item.type !== "divider") return true;
			if (index === 0 || index === self.length - 1) return false;
			if (self[index - 1]?.type === "divider") return false;
			return true;
		});
</script>

<style scoped>
	.divider {
		@apply bg-black h-5 ml-2 mr-2 md:mr-3 w-px;
	}
	.toolbar {
		display: flex;
		gap: 10px;
	}

	.toolbar-button {
		background: none;
		border: none;
		cursor: pointer;
	}

	.toolbar-button img {
		display: inline-block;
	}
</style>

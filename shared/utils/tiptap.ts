import { useFilterParagraphs } from "#shared/utils/useFilterParagraphs";
import { blockImages } from "#shared/utils/extensions";
import { nodeView } from "#shared/utils/connection";
import { Selection } from "@tiptap/extensions";
import { Editor } from "@tiptap/core";

import Highlight from "@tiptap/extension-highlight";
import Document from "@tiptap/extension-document";
import Image from "@tiptap/extension-image";

import { useModal } from "#shared/utils/useModal";

const pendingImages: Map<string, File> = new Map();

const appendImage = (currentEditor: Editor, file: File, pos?: number) => {
	const fileReader = new FileReader();

	fileReader.readAsDataURL(file);
	fileReader.onload = () => {
		const { create, close } = useModal();

		const result = fileReader.result as string;

		const onConfirm = async (attrs: { alt: string; title: string }) => {
			if (pos)
				currentEditor
					.chain()
					.insertContentAt(pos, {
						type: "image",
						attrs: { ...attrs, src: result },
					})
					.createParagraphNear()
					.focus()
					.run();
			else
				currentEditor
					.chain()
					.insertContentAt(currentEditor.state.selection.anchor, {
						type: "image",
						attrs: { ...attrs, src: result },
					})
					.createParagraphNear()
					.focus()
					.run();

			pendingImages.set(result, file);

			close();
		};

		create({
			name: "Afbeelding toevoegen",
			description: "Voer een bijschrift en alternatieve tekst in voor de afbeelding.",
			component: "ImageMeta",
			props: {
				content: {
					src: result,
				},
				onConfirm,
			},
		});
	};
};

//--------------------------------------------------------------------------------------------

const lowlight = createLowlight(all);

const fileHandler = FileHandler.configure({
	allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
	onDrop: (currentEditor, files, pos) => {
		//! issue with moving an existing image, needs to be fixed later
		//? only happens when draging an unfocused image

		files.forEach((file) => appendImage(currentEditor, file, pos));
	},
	onPaste: (currentEditor, files) => files.forEach((file) => appendImage(currentEditor, file)),
});

const details = Details.configure({
	persist: true,
	HTMLAttributes: { class: "details" },
});

const underline = Underline.configure({
	HTMLAttributes: {
		style: "text-underline-offset: 1px; text-decoration-color: #2563eb;",
	},
});

const link = Link.configure({
	openOnClick: false,
	HTMLAttributes: {
		style: "color: #1d4ed8; font-size: 1.125rem; text-decoration: underline; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;",
	},
});

const highlight = Highlight.configure({
	HTMLAttributes: {
		style: "background-color: #bfdbfe; border-radius: 0.375rem; padding: 0.2rem 0.25rem; text-align: center; font-size: 1rem; color: #1d4ed8;",
	},
});

const codelowBlock = CodeBlockLowlight.configure({
	lowlight,
	languageClassPrefix: "language-",
});

const image = Image.configure({
	inline: false,
	allowBase64: false,
});

const characterCount = CharacterCount.configure({
	limit: 2000000,
});

const articleDocument = Document.extend({
	content: "heading block*",
});

//--------------------------------------------------------------------------------------------

const starterKit = StarterKit.configure({
	link: false,
	underline: false,
	trailingNode: false,
	codeBlock: false,
	code: false,
	bulletList: {
		HTMLAttributes: {
			style: "padding-left: 1.25rem; list-style-type: disc; list-style-position: outside;",
		},
	},
	orderedList: {
		HTMLAttributes: {
			style: "padding-left: 1.5rem; list-style-type: decimal; list-style-position: outside;",
		},
	},
});

const articleStarterKit = StarterKit.configure({
	underline: false,
	document: false,
	link: false,
	trailingNode: false,
	codeBlock: false,
	gapcursor: false,
	bulletList: {
		HTMLAttributes: {
			style: "padding-left: 1.25rem; list-style-type: disc; list-style-position: outside;",
		},
	},
	orderedList: {
		HTMLAttributes: {
			style: "padding-left: 1.5rem; list-style-type: decimal; list-style-position: outside;",
		},
	},
});

//--------------------------------------------------------------------------------------------

const placeholder = Placeholder.configure({
	placeholder: () => {
		return `Begin je bericht hier...`;
	},
});

const artcilePlaceholder = Placeholder.configure({
	placeholder: ({ node }) => {
		if (node.type.name === "heading") return "Schrijf hier je titel...";
		if (node.type.name === "details") return "";
		return "Schrijf hier je content...";
	},
});

//--------------------------------------------------------------------------------------------

const replaceImageContent = (content: any, srcToFilename: Map<string, string>) => {
	return content.map((node: any) => {
		const type = node.type;

		if (type === "image") {
			const filename = srcToFilename.get(node.attrs.src);

			if (filename)
				return {
					...node,
					attrs: {
						...node.attrs,
						src: `/attachments/${filename}`,
					},
				};
		}

		return { ...node };
	});
};

const prepareFiles = (filtered: any) => {
	const sources: Map<string, string> = new Map();
	const files: Array<{ src: string; file: File }> = [];

	filtered.value.forEach((node: any) => {
		const src = node.attrs.src;
		const file = pendingImages.get(src);

		if (file) files.push({ src, file });
	});

	return { files, sources };
};

const prepareFormData = (files: Array<{ src: string; file: File }>, sources: Map<string, string>) => {
	const formData = new FormData();

	files.forEach(({ src, file }) => {
		const filename = `${file.name.replaceAll(" ", "-")}`;
		formData.append(filename, file);
		sources.set(src, filename);
	});

	return formData;
};

export const createContent = async (doc: any) => {
	if (!doc || !doc.content) return { document: doc };

	const content = doc.content;

	const { filtered } = useFilterParagraphs(content, "image");
	if (filtered.value.length === 0) return { document: doc };

	const { files, sources } = prepareFiles(filtered);
	if (files.length === 0) return { document: doc };

	const formData = prepareFormData(files, sources);
	const nodes = replaceImageContent(content, sources);

	return { document: { ...doc, content: nodes }, formData };
};

export const extensions = [starterKit, blockImages, underline, link, highlight, placeholder];

export const articleExtensions = [
	details,
	nodeView,
	blockImages,
	DetailsSummary,
	DetailsContent,
	codelowBlock,
	articleStarterKit,
	Selection,
	image,
	characterCount,
	fileHandler,
	articleDocument,
	underline,
	link,
	highlight,
	artcilePlaceholder,
];

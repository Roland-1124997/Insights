import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { DOMParser } from "prosemirror-model";
import type { EditorView } from "prosemirror-view";

export const blockImages = Extension.create({
	name: "blockImages",
	addProseMirrorPlugins() {
		return [
			new Plugin({
				props: {
					handlePaste(view, event) {
						const clipboard = (event as ClipboardEvent).clipboardData;
						const html = clipboard?.getData("text/html") || "";

						if (isHtml(html)) {
							sanitizePastedData(event, view, html);
							return true;
						}

						const items = clipboard?.items || [];

						for (const item of items) {
							if (item.type.startsWith("image/")) {
								event.preventDefault();
								return true;
							}
						}

						return false;
					},

					handleDrop(view, event) {
						const files = event.dataTransfer?.files || [];

						for (const file of files) {
							if (file.type.startsWith("image/")) {
								event.preventDefault();
								return true;
							}
						}

						return false;
					},
				},
			}),
		];
	},
});

const isHtml = (str: string) => /<\/?[a-z][\s\S]*>/i.test(str);

const createWrapper = (html: string) => {
	const wrapper = document.createElement("div");
	wrapper.innerHTML = html;
	wrapper.querySelectorAll("img").forEach((img) => img.remove());

	return wrapper;
};

const sanitizePastedData = (event: ClipboardEvent, view: EditorView, html: string) => {
	event.preventDefault();

	const wrapper = createWrapper(html);

	const Parser = DOMParser.fromSchema(view.state.schema);
	const slice = Parser.parseSlice(wrapper);
	const selection = view.state.tr.replaceSelection(slice);

	view.dispatch(selection.scrollIntoView());
};

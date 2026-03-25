import { mergeAttributes, Node } from "@tiptap/core";

export const nodeView = Node.create({
	name: "nodeView",
	group: "block",
	atom: true,
	addAttributes() {
		return {
			private: {
				default: false,
			},
			html_url: {
				default: null,
			},
			homepage: {
				default: null,
			},
		};
	},

	parseHTML() {
		return [
			{
				tag: "connection-view",
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		return ["connection-view", mergeAttributes(HTMLAttributes)];
	},

	addNodeView() {
		return ({ node }) => {
			const dom = document.createElement("div");
			dom.className = "flex items-center gap-2 p-2 px-2 mt-2 font-mono text-gray-100 transition-colors duration-200 rounded-lg connection-view w-fit bg-neutral-900";

			const details = { ...node.attrs };

			const icon = document.createElement("span");
			icon.className = "connection-icon";
			icon.setAttribute("aria-hidden", "true");
			icon.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" class="text-white">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2.01-.27c.68 0 1.36.09 2.01.27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            `;

			const content = document.createElement("div");
			content.className = "flex items-center gap-2 connection-content";

			function renderContent(attrs = details) {
				content.innerHTML = "";

				if (attrs.private) {
					const span = document.createElement("span");
					span.className = "text-xs text-gray-300 ";
					span.textContent = "Niet beschikbaar";
					content.appendChild(span);
				} else {
					const a = document.createElement("a");
					a.href = attrs.html_url || "#";
					a.target = "_blank";
					a.rel = "noopener noreferrer";
					a.className = "text-xs text-white text-gray-100 ";
					a.textContent = "Bekijk op GitHub";
					content.appendChild(a);
				}

				if (attrs.homepage) {
					const sep = document.createElement("span");
					sep.className = "px-1 text-gray-100";
					sep.textContent = "|";
					content.appendChild(sep);

					const a2 = document.createElement("a");
					a2.href = attrs.homepage;
					a2.target = "_blank";
					a2.rel = "noopener noreferrer";
					a2.className = "text-xs text-white text-gray-100";
					a2.textContent = "Website";
					content.appendChild(a2);
				}
			}

			renderContent();

			dom.appendChild(icon);
			dom.appendChild(content);

			return {
				dom,
				update: (updatedNode) => {
					if (!updatedNode) return false;
					const newAttrs = updatedNode.attrs || {};

					if (newAttrs.private === details.private && newAttrs.html_url === details.html_url && newAttrs.homepage === details.homepage) {
						return true;
					}

					details.private = !!newAttrs.private;
					details.html_url = newAttrs.html_url ?? null;
					details.homepage = newAttrs.homepage ?? null;
					renderContent(details);
					return true;
				},
			};
		};
	},
});

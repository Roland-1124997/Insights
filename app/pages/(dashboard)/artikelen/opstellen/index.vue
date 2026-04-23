<template>
	<div class="">
		<div class="">
			<div v-if="editor">
				<div class="grid grid-cols-1 md:grid-cols-[1fr_0.45fr] h-full">
					<div class="z-10 bg-white md:pr-4 md:border-r">
						<div class="relative flex flex-col mt-1 outline-none appearance-none md:mt-auto h-[85vh] md:h-[88vh]">
							<div class="sticky top-0 z-20 bg-white">
								<TiptapMenu v-if="!loaded" class="flex items-center p-1 py-1 mb-1 overflow-x-auto underline border rounded-lg bg-gray-50" :editor="editor" :editable />

								<FormBase :appendToBody :request :schema="schema.article.frontend" v-slot="{ loading, errors, meta }">
									<div v-if="!loaded" class="flex items-center justify-between gap-2 py-1 pb-3 mb-3 overflow-x-auto text-sm border-b">
										<p class="w-full p-2 text-center text-blue-600 border border-blue-600 rounded-md select-none">
											{{ words }}
											woord{{ words === 1 ? "" : "en" }}
										</p>

										<p v-if="Object.keys(errors).length" class="w-full p-2 text-center text-blue-600 border border-blue-600 rounded-md select-none">{{ Object.keys(errors).length }} fouten</p>

										<button
											@click.prevent="toggleEditable"
											class="flex items-center justify-center w-full gap-2 p-2 text-white bg-blue-600 border-blue-500 rounded-md outline-none cursor-pointer select-none hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
											<icon :name="!editable ? 'akar-icons:edit' : 'akar-icons:eye'" class="w-4 h-4" aria-hidden="true" />
											<span class="">{{ !editable ? "Bewerken" : "Voorbeeld" }}</span>
										</button>

										<button
											v-if="Object.keys(errors).length < 1"
											class="flex items-center justify-center w-full gap-2 p-2 text-white bg-blue-600 border-blue-500 rounded-md outline-none select-none hover:bg-blue-700 hover:text-white focus:text-white focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
											<icon name="akar-icons:save" class="w-4 h-4" aria-hidden="true" />
											<span class="">{{ editId ? "Bijwerken" : "Aanmaken" }}</span>
										</button>
									</div>

									<div class="sr-only" aria-hidden>
										<UtilsInput name="title" :initial-value="title" />
										<UtilsInput name="description" :initial-value="description" />
										<UtilsInput name="words" :initial-value="words" type="number" />
										<UtilsInput name="topics" :initial-value="topics" type="array" />
									</div>
								</FormBase>
							</div>

							<div ref="tiptap-container" class="relative flex-1 min-h-0 p-2 overflow-x-hidden overflow-y-auto md:p-10">
								<drag-handle v-if="editor" :editor="editor" :compute-position-config="{ placement: 'left-start', strategy: 'absolute' }">
									<div class="custom-drag-handle">
										<icon name="fluent:re-order-dots-20-filled" class="w-4 h-4 text-gray-800" aria-hidden="true" />
										<span class="sr-only">Sleep om te herordenen</span>
									</div>
								</drag-handle>

								<TiptapEditor v-if="!loaded" :editor="editor" aria-label="Artkel inhoud" />
							</div>
						</div>
					</div>
					<div class="overflow-scroll md:h-[88vh]">
						<TiptapTableList v-if="!loaded" :Anchors="Anchors" v-model="activeId" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { getHierarchicalIndexes, TableOfContents } from "@tiptap/extension-table-of-contents";
	import { DragHandle } from "@tiptap/extension-drag-handle-vue-3";
	import { NodeRange } from "@tiptap/extension-node-range";

	useSeoMeta({
		title: "Insights - Artikel Opstellen",
		description: "Schrijf een nieuw artikel of blog post voor je website.",
		ogTitle: "Insights - Artikel Opstellen",
		ogDescription: "Schrijf een nieuw artikel of blog post voor je website.",
		ogUrl: "/artikelen/opstellen",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Artikel Opstellen",
		twitterDescription: "Schrijf een nieuw artikel of blog post voor je website.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "app",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/png",
				href: "/icons/icon_512-blue.png",
			},
		],
	});

	const { addToast } = useToast();

	const store = useArticles();
	const storage = useStorage();

	const content = ref<Record<string, any>>();
	const activeId: any = ref(null);
	const editable = ref(true);

	const editId = computed(() => {
		const route = useRoute();
		return route.query.edit as string | undefined;
	});

	const loaded = ref(true);

	const container = useTemplateRef("tiptap-container");

	onMounted(async () => {
		setTimeout(() => {
			const images = container.value?.querySelectorAll<HTMLImageElement>("img") || [];

			for (const image of images) {
				if (image.src.endsWith("/github.jpg")) continue;

				if (image.complete && image.naturalWidth === 0) {
					image.src = "/github.jpg";
					continue;
				}

				image.addEventListener(
					"error",
					() => {
						if (image.src.endsWith("/github.jpg")) return;
						image.src = "/github.jpg";
					},
					{ once: true },
				);
			}
		}, 100);

		if (!editId.value) await new Promise((resolve) => setTimeout(resolve, 100));
		loaded.value = false;
	});

	if (editId.value) {
		const { data, error } = await useFetch(`/api/articles/${editId.value}`);
		if (error.value) content.value = store.articles?.find((article) => article.id === editId.value)?.content || store.getSavedPayload();
		else content.value = store.getSavedPayload() || data.value.data.content;
	} else content.value = store.getSavedPayload();

	const title = ref("");
	const description = ref("");
	const Anchors: any = ref([]);
	const words = ref(0);
	const topics = ref<string[]>([]);

	const populateUniqueAnchors = (uniqueAnchors: Anchor[], seenAnchorIds: Set<string>, anchor: Anchor) => {
		if (seenAnchorIds.has(anchor.id)) return;

		uniqueAnchors.push({
			id: anchor.id,
			level: anchor.level,
			isActive: anchor.isActive,
			itemIndex: anchor.itemIndex,
			textContent: anchor.textContent,
		});

		seenAnchorIds.add(anchor.id);
	};

	const populateFields = (editor: Editor) => {
		content.value = editor.getJSON();
		store.savePayload(content.value);

		words.value = editor.storage.characterCount.words();
		title.value = editor.$doc.firstChild?.textContent || "Ongetiteld Artikel";

		const items = editor.getJSON().content?.[1]?.content ?? [];
		topics.value = items.map((item: any) => item.text?.trim()).filter((text: string | undefined) => !!text);

		const { filtered } = useFilterParagraphs(content.value?.content, "paragraph");
		description.value = filtered.value[0] ? filtered.value[0].content[0]?.text : "";
	};

	const populateAnchors = (anchors: Anchor[]) => {
		const uniqueAnchors: Anchor[] = [];
		const seenAnchorIds = new Set<string>();

		activeId.value = anchors.filter((anchor) => anchor.isActive)[0]?.id || null;

		anchors.forEach((anchor) => populateUniqueAnchors(uniqueAnchors, seenAnchorIds, anchor));
		Anchors.value = uniqueAnchors;
	};

	const getScrollParent = () => {
		return container.value ?? window;
	};

	// Debounce for future syncing or autosaving features
	const { wait } = useDebounce();

	const editor = useEditor({
		content: content.value,
		editable: editable.value,
		extensions: [
			...articleExtensions,
			TableOfContents.configure({
				getIndex: getHierarchicalIndexes,
				onUpdate: (anchors) => populateAnchors(anchors),
				scrollParent: getScrollParent,
			}),
			NodeRange.configure({
				key: null,
			}),
		],
		onCreate: ({ editor }) => populateFields(editor),
		onUpdate: ({ editor }) => populateFields(editor),
	});

	onUnmounted(() => {
		if (editor.value) editor.value.destroy();
	});

	onBeforeRouteLeave(() => {
		store.clearSavedPayload();
	});

	const toggleEditable = () => {
		editable.value = !editable.value;
		if (editor.value) editor.value.setEditable(editable.value);

		addToast({
			message: `De editor is nu in ${editable.value ? "bewerkings" : "voorbeeld"}-modus.`,
			type: "info",
		});
	};

	const successMessage = editId.value ? "Het artikel is succesvol bijgewerkt." : "Het artikel is succesvol aangemaakt.";
	const failureMessage = editId.value
		? "Er is een fout opgetreden bij het bijwerken van het artikel. Probeer het later opnieuw."
		: "Er is een fout opgetreden bij het aanmaken van het artikel. Probeer het later opnieuw.";

	const { upload, setFormData } = useHandleFormData(successMessage, failureMessage);

	const request: requestOptions<{ id: number }> = {
		url: editId.value ? `/api/articles/${editId.value}` : "/api/articles",
		method: editId.value ? "PATCH" : "POST",
		onsuccess: async (response) => {
			await upload(response.data?.id);
			await store.refresh();
			await storage.refresh();
		},
		onfailure: () =>
			addToast({
				message: failureMessage,
				type: "error",
			}),
	};

	const appendToBody = async (values: any) => {
		addToast({
			message: "Het artikel wordt opgeslagen...",
			type: "info",
		});

		const { document, formData } = await createContent(content.value);
		content.value = document;
		setFormData(formData);

		return {
			...values,
			content: content.value,
			anchors: Anchors.value,
		};
	};
</script>

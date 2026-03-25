<template>
	<section class="w-full pb-[5.5rem] md:pb-0">
		<div v-if="file" class="grid items-stretch w-full gap-4 md:grid-cols-2">
			<article class="flex flex-col overflow-x-hidden overflow-y-scroll bg-white border h-fit rounded-2xl border-slate-200">
				<div class="bg-gray-100">
					<img v-if="isImage" :src="file.media" :alt="file.name" class="object-contain min-h-[24vh] md:h-[60vh] w-full" />
					<template v-else-if="isPDF">
						<div class="relative h-[61vh] md:h-[64.5vh] overflow-y-scroll overflow-x-hidden">
							<ClientOnly>
								<VuePdfEmbed
									class="h-full transition-opacity duration-300"
									:class="pdfReady ? 'opacity-100' : 'opacity-0'"
									annotation-layer
									text-layer
									:source="file.media"
									@rendered="handlePdfRendered" />

								<transition
									enter-active-class="transition-opacity duration-300"
									leave-active-class="transition-opacity duration-300"
									enter-from-class="opacity-0"
									enter-to-class="opacity-100"
									leave-from-class="opacity-100"
									leave-to-class="opacity-0">
									<div v-if="!pdfReady" class="absolute inset-0 flex items-center justify-center text-sm text-gray-600">Preview laden...</div>
								</transition>

								<template #fallback>
									<div class="flex items-center justify-center h-full text-sm text-gray-600">Geen preview beschikbaar</div>
								</template>
							</ClientOnly>
						</div>
					</template>

					<div v-else class="flex items-center justify-center text-sm h-[35vh] md:h-[60vh] text-gray-600">Geen preview beschikbaar</div>
				</div>

				<div class="flex-1 p-5 space-y-4">
					<div class="flex items-start justify-between gap-3">
						<h1 class="text-lg font-semibold truncate text-slate-900 sm:text-xl">
							{{ file.name.split(".")[0] }}
						</h1>
						<span class="px-3 py-1 text-xs font-medium rounded-lg" :class="file.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'">
							{{ publicationStatus }}
						</span>
					</div>

					<p class="text-sm text-slate-700">{{ file.id }}</p>

					<button
						@click="store.download(file)"
						class="flex items-center justify-center gap-3 p-2 px-6 text-blue-600 transition-colors duration-150 bg-white border border-blue-500 rounded-lg outline-none select-none w-fit hover:bg-blue-50 hover:text-blue-700 hover:border-blue-600 hover focus:text-blue-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
						<icon name="akar-icons:cloud-download" class="w-4 h-4" aria-hidden="true" />
						<span> Download </span>
					</button>
				</div>
			</article>

			<aside class="flex flex-col w-full h-full gap-4 md:gap-5">
				<div class="relative w-full p-5 overflow-hidden bg-white border rounded-2xl border-slate-200">
					<h2 class="relative mb-4 text-sm font-semibold tracking-wide uppercase text-slate-600">Item details</h2>

					<dl class="relative grid gap-3 text-sm">
						<div class="p-3 border rounded-xl border-slate-200 bg-slate-50/80">
							<h3 class="text-xs font-semibold tracking-wide uppercase text-slate-500">Artikel</h3>
							<dd class="mt-1 font-medium text-balance text-slate-900">
								{{ file.article_name || "Geen koppeling" }}
							</dd>
						</div>
						<div class="p-3 border rounded-xl border-slate-200 bg-slate-50/80">
							<h3 class="text-xs font-semibold tracking-wide uppercase text-slate-500">Pad</h3>
							<dd class="mt-1 font-medium break-all text-balance text-slate-900">
								{{ file.media }}
							</dd>
						</div>
					</dl>
				</div>

				<div class="relative flex-1 w-full p-5 overflow-hidden bg-white border rounded-2xl border-slate-200">
					<h2 class="relative mb-4 text-sm font-semibold tracking-wide uppercase text-slate-600">Metadata</h2>

					<dl class="relative grid gap-3 text-sm md:grid-cols-2">
						<div class="p-3 border rounded-xl border-slate-200 bg-slate-50/80">
							<h3 class="text-xs font-semibold tracking-wide uppercase text-slate-500">Type</h3>
							<p class="mt-1 font-medium text-slate-900">
								{{ file.metadata?.label || "-" }}
							</p>
						</div>
						<div class="p-3 border rounded-xl border-slate-200 bg-slate-50/80">
							<h3 class="text-xs font-semibold tracking-wide uppercase text-slate-500">MIME</h3>
							<p class="mt-1 font-medium break-all text-slate-900">
								{{ file.metadata?.mimetype || "-" }}
							</p>
						</div>
						<div class="p-3 border rounded-xl border-slate-200 bg-slate-50/80">
							<h3 class="text-xs font-semibold tracking-wide uppercase text-slate-500">Grootte</h3>
							<p class="mt-1 font-medium text-slate-900">
								{{ file.metadata?.size || "-" }}
							</p>
						</div>
						<div class="p-3 border rounded-xl border-slate-200 bg-slate-50/80 md:col-span-2">
							<h3 class="text-xs font-semibold tracking-wide uppercase text-slate-500">Aangemaakt</h3>
							<NuxtTime
								class="block mt-1 font-medium text-slate-900"
								locale="nl"
								weekday="long"
								year="numeric"
								month="short"
								day="2-digit"
								hour="2-digit"
								minute="2-digit"
								:datetime="file.metadata.created_at" />
						</div>
						<div class="p-3 border rounded-xl border-slate-200 bg-slate-50/80 md:col-span-2">
							<h3 class="text-xs font-semibold tracking-wide uppercase text-slate-500">Bijgewerkt</h3>
							<NuxtTime
								class="block mt-1 font-medium text-slate-900"
								locale="nl"
								weekday="long"
								year="numeric"
								month="short"
								day="2-digit"
								hour="2-digit"
								minute="2-digit"
								:datetime="file.metadata.updated_at" />
						</div>
					</dl>
				</div>
			</aside>
		</div>

		<div v-else class="p-8 text-center bg-white border border-dashed rounded-2xl border-slate-300 text-slate-500">Geen media-item gevonden.</div>
	</section>
</template>

<script setup lang="ts">
	import VuePdfEmbed from "vue-pdf-embed";

	// Optional styles
	import "vue-pdf-embed/dist/styles/annotationLayer.css";
	import "vue-pdf-embed/dist/styles/textLayer.css";

	useSeoMeta({
		title: "Insights - Mediabank",
		description: "Overzicht van opslag en bestanden.",
		ogTitle: "Insights - Mediabank",
		ogDescription: "Overzicht van opslag en bestanden.",
		ogUrl: "/mediabank",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Mediabank",
		twitterDescription: "Overzicht van opslag en bestanden.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "summary",
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

	const route = useRoute();
	const id = route.params.id as string;

	const { data } = await useFetch(`/api/storage/${id}`);

	const store = useStorage();

	const file = computed(() => data.value?.data);
	const isImage = computed(() => file.value?.metadata?.mimetype?.startsWith("image/") ?? false);
	const isPDF = computed(() => file.value?.metadata?.mimetype === "application/pdf");
	const publicationStatus = computed(() => (file.value?.published ? "Zichtbaar" : "Verborgen"));

	const pdfReady = ref(false);

	watch(
		() => file.value?.media,
		() => {
			pdfReady.value = false;
		},
	);

	const handlePdfRendered = () => {
		pdfReady.value = true;
	};
</script>

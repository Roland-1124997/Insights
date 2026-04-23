<template>
	<div
		v-for="article in articles"
		:key="article.id"
		class="relative z-10 flex flex-col h-full p-0 overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 rounded-2xl">
		<div class="flex flex-col flex-1 gap-3 p-5 pt-2">
			<div class="flex items-start justify-between gap-2 mt-3">
				<h2 class="text-xl font-bold leading-6 capitalize text-slate-900 line-clamp-2 min-h-12">
					{{ article.title }}
				</h2>

				<div class="flex items-center justify-between gap-2 select-none">
					<NuxtLink
						:to="`/artikelen/opstellen?edit=${article.id}`"
						class="flex items-center justify-center transition-colors bg-gray-200 rounded-lg w-7 h-7 hover:text-white hover:bg-blue-700 focus:outline-none focus:bg-transparent focus:text-blue-700 focus:ring-2 focus:ring-blue-300"
						title="Bewerken">
						<icon name="akar-icons:edit" class="w-4 h-4" aria-hidden="true" />
					</NuxtLink>
					<button
						:aria-label="article.published ? 'Gepubliceerd' : 'Concept'"
						@click="store.togglePublish(article)"
						class="flex items-center justify-center transition-colors bg-gray-200 rounded-lg w-7 h-7 hover:text-white hover:bg-teal-600 focus:bg-transparent focus:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300"
						:title="article.published ? 'Gepubliceerd' : 'Concept'">
						<icon :name="article.published ? 'akar-icons:toggle-on' : 'akar-icons:toggle-off'" class="w-4 h-4" aria-hidden="true" />
					</button>
					<button
						aria-label="verwijder articleikel"
						@click="store.remove(article.id)"
						class="flex items-center justify-center transition-colors bg-gray-200 rounded-lg w-7 h-7 hover:text-white hover:bg-red-700 focus:bg-transparent focus:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
						title="Verwijderen">
						<icon name="akar-icons:trash-can" class="w-4 h-4" aria-hidden="true" />
					</button>
				</div>
			</div>

			<p class="mb-2 text-sm leading-5 text-gray-600 line-clamp-2 min-h-10 md:line-clamp-3 md:min-h-[3.75rem]">
				{{ article.description || "Geen beschrijving beschikbaar" }}
			</p>

			<img @error="handleImageError" :src="article?.thumbnail_url ? article?.thumbnail_url : '/github.jpg'" :alt="`Thumbnail voor ${article.title}`" class="object-cover object-top w-full h-40 mb-2 bg-white border rounded-lg select-none" />

			<div class="flex flex-wrap items-center gap-2 mb-2 select-none">
				<span v-for="topic in article.topics" :key="topic" class="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-md">
					<icon name="akar-icons:hashtag" class="w-3 h-3" />
					{{ topic }}
				</span>
			</div>

			<div class="flex flex-wrap items-center gap-2 mt-auto text-xs select-none">
				<span v-if="article.words" aria-label="hoeveelheid woorden" class="flex items-center gap-1 px-2 py-1 text-gray-900 bg-gray-100 rounded-full">
					<icon name="akar-icons:file" class="w-4 h-4" aria-hidden="true" />
					{{ article.words }} woorden
				</span>
				<span v-if="article.read_time" aria-label="gemiddelde leestijd" class="flex items-center gap-1 px-2 py-1 text-gray-900 bg-gray-100 rounded-full">
					<icon name="akar-icons:clock" class="w-4 h-4" aria-hidden="true" />
					{{ article.read_time }} min
				</span>
				<span v-if="article.updated_at" aria-label="laatst aangepast op" class="flex items-center gap-1 px-2 py-1 text-gray-900 bg-gray-100 rounded-full">
					<icon name="akar-icons:history" class="w-4 h-4" aria-hidden="true" />
					<NuxtTime :datetime="article.updated_at" year="2-digit" month="2-digit" day="2-digit" hour="2-digit" minute="2-digit" />
				</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		articles: Array<{
			id: string;
			title: string;
			description?: string;
			thumbnail_url?: string;
			topics: string[];
			words?: number;
			read_time?: string;
			updated_at?: string;
			published: boolean;
		}>;
	}>();

	const store = useArticles();

	const handleImageError = (event: Event) => {
		const target = event.target as HTMLImageElement;
		target.src = "/github.jpg";
	};

</script>

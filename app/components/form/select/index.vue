<template>
	<div class="w-full mb-3 md:mb-auto">
		<template v-if="!details">
			<UtilsInputSearch name="github" placeholder="Zoek in repositories" v-model="external" />
			<div class="grid gap-3 grid-cols-2 mt-3 xl:grid-cols-3 max-h-[48vh] overflow-y-auto">
				<button
					v-for="repo in filteredContent"
					:key="repo.id"
					type="button"
					@click="selectRepo(repo.id)"
					class="flex flex-col h-full p-4 text-left transition border rounded-2xl focus:outline-none"
					:class="selected === repo.id ? 'border-gray-200 bg-gray-100 ' : 'border-gray-200 bg-white/80 hover:bg-gray-50'">
					<div class="flex items-start justify-between gap-3 mb-3">
						<div>
							<h3 class="font-semibold text-gray-900 truncate text-balance">{{ repo.name }}</h3>
							<p class="text-xs text-gray-500">
								<span v-if="repo.private">Privé</span>
								<span v-else>Publiek</span>
							</p>
						</div>
					</div>

					<p class="flex-1 text-sm leading-6 text-gray-600 line-clamp-3">
						{{ repo.description || "Geen beschrijving beschikbaar." }}
					</p>
				</button>
			</div>

			<div v-if="!filteredContent.length" class="flex flex-col items-center justify-center w-full h-[46vh] mt-3 text-sm text-gray-500 border border-gray-200 rounded-xl">
				<p class="mb-1 text-base font-semibold text-gray-900">Geen repositories gevonden</p>
				<p class="mb-3 text-sm text-gray-700 text-balance">Er zijn geen repositories die overeenkomen met je zoekopdracht:</p>
				<div class="flex items-center justify-center w-full">
					<div class="flex items-center gap-2 px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-md">
						<icon name="akar-icons:search" class="w-3 h-3" />
						<p>{{ external }}</p>
					</div>
				</div>
			</div>
		</template>

		<template v-else>
			<div class="mt-3">
				<div class="flex flex-col h-full p-4 text-left transition border border-gray-200 rounded-2xl focus:outline-none bg-white/80">
					<div class="flex items-start justify-between gap-3 mb-3">
						<div>
							<h3 class="text-lg font-semibold text-gray-900 truncate text-balance">{{ details.name }}</h3>
							<p class="text-xs text-gray-500">{{ details.full_name }}</p>
						</div>
						<p class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md">
							<span v-if="details.private">Privé</span>
							<span v-else>Publiek</span>
						</p>
					</div>

					<div v-if="details.topics?.length" class="flex flex-wrap gap-2 mb-4">
						<span v-for="topic in details.topics" :key="topic" class="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md">
							{{ topic }}
						</span>
					</div>

					<div>
						<p class="mb-2 text-sm font-medium text-gray-700">Links</p>
						<div class="flex gap-2 mb-4">
							<a :href="details.html_url" target="_blank" class="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md">
								<icon name="akar-icons:github-fill" class="w-4 h-4" aria-hidden="true" />
								<span class="ml-1">GitHub</span>
							</a>
							<a
								v-if="details.homepage"
								:href="details.homepage"
								target="_blank"
								class="flex items-center gap-2 px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md">
								<icon name="akar-icons:link-chain" class="w-4 h-4" aria-hidden="true" />
								<span class="ml-1">Website</span>
							</a>
						</div>
					</div>

					<p class="mb-4 text-sm leading-6 text-gray-600">
						{{ details.description || "Geen beschrijving beschikbaar." }}
					</p>
				</div>

				<button
					type="button"
					@click="props.onConfirm(details)"
					class="flex mt-2 items-center justify-center w-full gap-2.5 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 border-blue-600 rounded-xl outline-none select-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
					Koppel repository
				</button>

				<button
					type="button"
					@click="unselectRepo"
					class="flex items-center justify-center w-full gap-2.5 px-5 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-200 bg-white border border-gray-300 rounded-xl outline-none select-none hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400">
					Terug naar overzicht
				</button>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
	const selected = ref<number | null>(null);
	const details = ref<Repo | null>(null);

	const { props } = defineProps<{
		props: Record<string, any>;
	}>();

	const content = computed<Repo[]>(() => props.content || []);
	const external = ref<string>("");

	const filteredContent = computed(() => {
		return content.value.filter((repo) => repo.name.toLowerCase().includes(external.value.toLowerCase()));
	});

	const selectRepo = (id: number) => {
		selected.value = id;
		details.value = filteredContent.value.find((r) => r.id === id) || null;
	};

	const unselectRepo = () => {
		selected.value = null;
		details.value = null;
	};
</script>

<template>
	<div class="relative w-full mb-3 md:mb-auto">
		<div class="relative w-full">
			<button
				type="button"
				@click="toggleDropdown"
				class="w-full p-3 pl-10 text-left text-gray-900 transition border rounded-xl bg-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 disabled:opacity-60 disabled:cursor-not-allowed"
				:class="{ 'ring-2 ring-indigo-500/60 border-indigo-500/60': isOpen }">
				<span v-if="selected" class="block truncate">
					{{ content.find((r) => r.id === selected)?.full_name }}
				</span>
				<span v-else class="block text-gray-600">Kies een repository...</span>
				<icon
					name="mdi:chevron-down"
					class="absolute w-5 h-5 text-gray-900 transition-transform transform -translate-y-1/2 pointer-events-none right-3 top-1/2"
					:class="{ 'rotate-180': isOpen }"
					aria-hidden="true" />
			</button>

			<icon name="bxl:github" class="absolute w-5 h-5 text-gray-900 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" aria-hidden="true" />

			<div v-if="isOpen" class="absolute z-50 w-full mt-3 overflow-auto bg-white ring-2 ring-indigo-500/60 border rounded-xl max-h-[13rem] -top-[14.5rem] md:top-auto scroll-snap-y">
				<ul class="">
					<li
						v-for="repo in content"
						:key="repo.id"
						@click="selectOption(repo.id)"
						class="px-3 py-2 transition-colors border-t border-indigo-100 cursor-pointer first:border-t-0 hover:bg-indigo-50 scroll-snap-align"
						:class="{ 'bg-indigo-100 font-medium': selected === repo.id }">
						{{ repo.full_name }}
					</li>
				</ul>
			</div>
		</div>

		<div v-if="details" class="p-2 pt-2 mt-2 text-sm border rounded-lg">
			<div class="flex flex-wrap gap-2 mb-2">
				<span v-for="topic in details.topics" :key="topic" class="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-md">
					{{ topic }}
				</span>
			</div>

			<p class="pt-1 pb-2 mb-2 text-sm text-gray-600 border-y text-balance">
				{{ details.description }}
			</p>

			<div class="flex items-center gap-2 p-1 px-2 mt-1 font-mono text-xs text-gray-100 rounded-lg w-fit bg-neutral-900">
				<icon name="bxl:github" class="w-4 h-4" aria-hidden="true" />
				<span v-if="details.private" class="text-gray-300"> Niet beschikbaar </span>
				<a v-else :href="details.html_url" target="_blank">Bekijk op GitHub </a>

				<span v-if="details.homepage">|</span>

				<icon v-if="details.homepage" name="fluent:link-20-filled" class="w-4 h-4" aria-hidden="true" />
				<a v-if="details.homepage" :href="details.homepage" target="_blank">Website </a>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	interface Repo {
		id: number;
		name: string;
		full_name: string;
		html_url: string;
		description?: string | null;
		homepage?: string | null;
		topics?: string[];
		private?: boolean;
	}

	const selected = ref<number | null>(null);
	const details = ref();
	const isOpen = ref(false);

	const { content, editor } = defineProps<{
		content: Repo[];
		editor: Editor;
	}>();

	const toggleDropdown = () => {
		isOpen.value = !isOpen.value;
	};

	const selectOption = (id: number) => {
		selected.value = id;
		isOpen.value = false;
		selectRepo(id);
	};

	watch(selected, (value) => {
		if (value !== null) selectRepo(value);
	});

	const selectRepo = (id: number) => {
		selected.value = id;
		details.value = content.find((r) => r.id === id) || null;

		const repo = content.find((r) => r.id === id);
		if (!repo || !editor) return;

		const tagsHtml = (repo.topics || []).map((topic) => `<strong><mark>${topic.toUpperCase()}</mark></strong>`).join(" ");

		const html = `
			<h1 class="mb-3 text-3xl font-bold">${repo.name.replaceAll("/", "-")}</h1>
			<div class="flex items-center mb-4">${tagsHtml}</div>
			<hr class="my-3" />
			<img src="https://t2.tudocdn.net/510706?w=1920" alt="GitHub " contenteditable="false" draggable="true">
			<p class="mb-4 text-sm text-gray-700">${repo.description ?? ""}</p>
			<hr class="my-3" />
			<connection-view private="${repo.private}" html_url="${repo.html_url}" homepage="${repo.homepage}"> </connection-view>
		`;

		editor.commands.setContent(html);
		isOpen.value = !isOpen.value;
	};
</script>

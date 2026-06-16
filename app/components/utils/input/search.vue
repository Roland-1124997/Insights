<template>
	<field :name="name" v-slot="{ field }">
		<div :name="name" role="search" class="relative w-full">
			<label :for="name" class="sr-only">{{ label }}</label>
			<input
				:disabled="disabled"
				:value="localSearch"
				@input="onInput"
				:id="name"
				:placeholder
				type="search"
				class="w-full p-2 pl-10 text-gray-900 transition border rounded-xl bg-white/80 placeholder:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 disabled:opacity-60"
				autocomplete="off"
				spellcheck="true"
				role="searchbox"
				:aria-label="label" />
			<icon name="akar-icons:search" class="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" aria-hidden="true" />
		</div>
	</field>
</template>

<script setup lang="ts">
	const { name, initialValue, toolbar } = defineProps({
		toolbar: { type: Object as PropType<ToolBar | undefined>, default: undefined },
		name: { type: String, required: true },
		label: { type: String, default: "text" },
		placeholder: { type: String, default: "" },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		initialValue: { type: String, default: "" },
	});

	const external = defineModel();

	const { value } = useField<string>(`${name}`);
	value.value = initialValue;

	const route = useRoute();
	const localSearch = ref<string>("");
	const localHistory = ref<string>("");
	const sourcePath = ref<string>(route.path);

	// Conditional: only initialize useSearch if toolbar is provided
	const hasToolbar = toolbar !== undefined;
	const searchUtils = hasToolbar
		? useSearch({
				localSearch,
				callback: async (params) => {
					await useInitilizeStore(toolbar, params);
				},
			})
		: null;

	if (hasToolbar && searchUtils) {
		localHistory.value = searchUtils.history.LastEntry(route.path)?.search || "";
	}

	const onInput = (event: Event) => {
		sourcePath.value = route.path;
		localSearch.value = (event.target as HTMLInputElement).value;
	};

	onMounted(() => {
		sourcePath.value = route.path;
		localSearch.value = (route.query.search as string) || localHistory.value;
	});

	watch(
		() => route.path,
		(path) => {
			sourcePath.value = path;
			if (hasToolbar && searchUtils) {
				localSearch.value = (route.query.search as string) || searchUtils.history.LastEntry(path)?.search || "";
			}
		},
	);

	watchDebounced(
		localSearch,
		async (newValue) => {
			if (hasToolbar && searchUtils) {
				await searchUtils.setSearch(newValue, sourcePath.value);
			} else {
				external.value = newValue;
			}
		},
		{ immediate: false, debounce: 1000, maxWait: 5000 },
	);
</script>

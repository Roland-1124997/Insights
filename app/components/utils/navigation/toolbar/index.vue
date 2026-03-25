<template>
	<div>
		<div class="hidden">
			<label class="sr-only" for="file">file</label>
			<input id="file" ref="inputRef" type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.jpg,.jpeg,.png,.gif,.webp" @change="handleFileSelect" class="sr-only" />
		</div>

		<div v-if="toolbar && (toolbar.buttons || toolbar.filters || toolbar.search)" class="z-40">
			<div
				v-if="toolbar?.groupWithFilters"
				:class="[!toolbar?.groupWithFilters ? '' : 'flex-wrap']"
				class="flex items-center justify-between w-full gap-3 px-4 py-2 bg-white border-b md:flex-nowrap lg:px-4">
				<UtilsInputSearch v-if="toolbar.search" :toolbar name="search" :label="toolbar.search.label" :placeholder="toolbar.search.placeholder" :disabled="pending" />

				<div class="flex items-center w-full gap-[0.35rem]">
					<UtilsButtonImportant
						v-for="(btn, index) in toolbar.buttons"
						:key="index"
						:to="btn.to"
						:icon-name="checkIconButton(btn)"
						:description="btn.description"
						:isButton="btn.isButton"
						:isSmall="btn.isSmall"
						@click="checkClickAction(btn)"
						:loading="isRefreshButton(btn) ? pending : false" />
					<UtilsButtonFilter
						v-if="toolbar.filters"
						v-for="filterItem in toolbar.filters"
						:activeType
						:loading="pending"
						:setFilter
						:filter
						:always-show-label="filterItem.alwaysShowLabel"
						:key="filterItem.type"
						:type="filterItem.type"
						:iconName="filterItem.iconName"
						:label="filterItem.label"
						:short-label="filterItem.shortLabel"
						:color="filterItem.color"
						:large="filterItem.large" />
				</div>
			</div>

			<div v-else class="flex flex-col items-center justify-between w-full gap-3 px-4 py-2 bg-white border-b md:flex-nowrap lg:px-4">
				<div class="flex items-center justify-between w-full gap-2">
					<UtilsInputSearch v-if="toolbar.search" :toolbar name="search" :label="toolbar.search.label" :placeholder="toolbar.search.placeholder" :disabled="pending" />
					<UtilsButtonImportant
						v-if="toolbar.buttons"
						v-for="(btn, index) in toolbar.buttons"
						:key="index"
						:to="btn.to"
						:icon-name="checkIconButton(btn)"
						:description="btn.description"
						:isButton="btn.isButton"
						:isSmall="btn.isSmall"
						@click="checkClickAction(btn)"
						:loading="isRefreshButton(btn) ? pending : false" />
				</div>

				<div v-if="toolbar.filters" class="flex items-center justify-between w-full gap-2">
					<UtilsButtonFilter
						v-for="filterItem in toolbar.filters"
						:activeType
						:loading="pending"
						:setFilter
						:filter
						:always-show-label="filterItem.alwaysShowLabel"
						:key="filterItem.type"
						:type="filterItem.type"
						:iconName="filterItem.iconName"
						:label="filterItem.label"
						:short-label="filterItem.shortLabel"
						:color="filterItem.color"
						:large="filterItem.large" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const storageStore = useStorage();

	const { toolbar, related } = defineProps({
		toolbar: { type: Object as PropType<ToolBar>, default: null },
		related: { type: Array as PropType<string[] | null>, default: null },
	});

	const store = computed(() => useRouterStore(toolbar.store) as StoreType);
	const fallbackFilter = computed(() => toolbar?.fallbackFilter || null);

	const { activeType, loading, filter, setFilter } = useFilter(
		{
			enableWatch: true,
			fallbackFilter: fallbackFilter,
			callback: async (params) => {
				await useInitilizeStore(toolbar, params);
			},
		},
		{
			related: related,
		},
	);

	const pending = computed(() => store.value.loading || loading.value || false);
	const inputRef = ref<HTMLInputElement | null>(null);

	const triggerFileSelect = () => inputRef.value?.click();

	const handleFileSelect = async (event: Event) => {
		const input = event.target as HTMLInputElement;

		if (input.files) {
			await storageStore.upload(input.files);
			input.value = "";
		}
	};

	const { subscribe, unsubscribe, active } = await usePush();

	const isRefreshButton = (btn: Buttons) => btn.onClick === "refresh";
	const isFileSelectButton = (btn: Buttons) => btn.onClick === "triggerFileSelect";
	const isSubscribeButton = (btn: Buttons) => btn.onClick === "subscribe";
	const isUnsubscribeButton = (btn: Buttons) => btn.onClick === "unsubscribe";

	const checkIconButton = (btn: Buttons) => {
		if (isSubscribeButton(btn) || isUnsubscribeButton(btn)) {
			if (active.value) return "ri:notification-off-line";
			else if (!active.value) return "ri:notification-3-line";
		}

		return btn.iconName;
	};

	const checkClickAction = (btn: Buttons) => {
		if (isFileSelectButton(btn)) triggerFileSelect();
		else if (isRefreshButton(btn)) store.value.refresh?.();
		else if (isSubscribeButton(btn) || isUnsubscribeButton(btn)) {
			if (active.value) unsubscribe();
			else if (!active.value) subscribe();
		}
	};
</script>

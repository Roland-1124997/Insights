<template>
	<UtilsEmailsCardItem v-for="inbox in store.messages" :key="inbox.id" :inbox="inbox" :parent="parent" @visibilityChanged="onVisibilityChanged" />
</template>

<script setup lang="ts">
	const emit = defineEmits<{
		lastVisibleChanged: [id: string | null];
	}>();

	const { parent } = defineProps<{
		parent: HTMLElement | null;
	}>();

	const store = useNotifications();
	const lastVisibleInboxId = ref<string | null>(null);
	const visibilityById = ref<Record<string, boolean>>({});

	const onVisibilityChanged = (id: string, isVisible: boolean) => {
		visibilityById.value[id] = isVisible;
	};

	watch(
		() => store.messages.map((message) => message?.id).filter((id): id is string => Boolean(id)),
		(ids) => {
			const next: Record<string, boolean> = {};
			for (const id of ids) next[id] = visibilityById.value[id] ?? false;
			visibilityById.value = next;
		},
		{ immediate: true },
	);

	const computedLastVisibleInboxId = computed<string | null>(() => {
		const ids = store.messages.map((message) => message?.id).filter((id): id is string => Boolean(id));

		for (let index = ids.length - 1; index >= 0; index--) {
			const id = ids[index];
			if (id && visibilityById.value[id]) return id;
		}

		return null;
	});

	watch(
		computedLastVisibleInboxId,
		(id) => {
			lastVisibleInboxId.value = id;
			emit("lastVisibleChanged", id);
		},
		{ immediate: true },
	);
</script>

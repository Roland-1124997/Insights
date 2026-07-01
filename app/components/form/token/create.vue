<template>
	<div class="w-full h-full">
		<Form @submit="props.onConfirm" :validation-schema="schema.fileMeta.frontend" v-slot="{ errors, meta }" class="flex flex-col max-h-[64vh]">
			<button
				type="submit"
				class="flex mt-3 items-center justify-center w-full gap-2.5 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 border-blue-600 rounded-xl outline-none select-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
				<icon name="akar-icons:save" class="w-5 h-5" aria-hidden="true" />
				<span>Opslaan</span>
			</button>
		</Form>
	</div>
</template>

<script lang="ts" setup>
	defineProps<{
		props: Record<string, any>;
	}>();
</script>

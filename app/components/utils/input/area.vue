<template>
	<field :name="name" v-slot="{ field, meta }">
		<div class="group">
			<label :class="hideLabel ? ' sr-only' : ''" class="flex items-center justify-between mb-2 text-sm font-medium text-gray-700 select-none" :for="name">
				<div>
					{{ label }}
					<span class="text-red-700">{{ required ? "* " : "" }}</span>
					<transition name="fade">
						<span v-if="meta.validated && !meta.valid" class="text-red-700"> (<ErrorMessage :name="name" />) </span>
					</transition>
				</div>
			</label>

			<textarea
				v-bind="field"
				:disabled
				:id="name"
				:placeholder
				autocomplete="on"
				class="w-full p-3 h-[12vh] text-gray-900 transition border resize-none rounded-xl bg-white/80 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-400"
				:class="meta.validated && !meta.valid ? 'focus:ring-red-500/60 focus:border-red-500/60 border-red-500 ' : 'focus:ring-indigo-500/60 focus:border-indigo-500/60'">
			</textarea>
		</div>
	</field>
</template>

<script setup lang="ts">
	const { type, name, initialValue } = defineProps({
		name: { type: String, required: true },
		label: { type: String, default: "text" },
		type: { type: String, default: "text" },
		placeholder: { type: String, default: "" },
		required: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },
		initialValue: { type: [String, Number, Array], default: "" },
		iconName: { type: String, default: "akar-icons:tag" },
		hideLabel: { type: Boolean, default: false },
	});

	const { value } = useField<string | Array<any> | number>(`${name}`);

	watch(
		() => initialValue,
		(initial) => (value.value = initial),
		{ immediate: true },
	);
</script>

<style scoped>
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}
	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>

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

				<div aria-label="toggle wachtwoord" class="cursor-pointer select-none" v-if="type === 'password'" @click="togglePassword">
					<span v-if="showPassword"> Verberg </span>
					<span v-else> Toon </span>
				</div>
			</label>

			<div class="relative">
				<span class="absolute inset-y-0 flex items-center text-gray-400 pointer-events-none left-3">
					<Icon :name="iconName" size="1.1rem" />
				</span>
				<input
					v-bind="field"
					:disabled
					:id="name"
					:placeholder
					:type="inputType"
					autocomplete="on"
					class="w-full p-3 pl-10 text-gray-900 transition border rounded-xl bg-white/80 focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-400"
					:class="meta.validated && !meta.valid ? 'focus:ring-red-500/60 focus:border-red-500/60 border-red-500 ' : 'focus:ring-indigo-500/60 focus:border-indigo-500/60'" />
			</div>
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

	const inputType = computed(() => (type == "password" ? (showPassword.value ? "text" : "password") : type));

	const showPassword = ref(false);

	const togglePassword = () => {
		showPassword.value = !showPassword.value;
	};
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

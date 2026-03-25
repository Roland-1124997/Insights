<template>
	<field name="code" v-model="value" v-slot="{ field, meta }: any">
		<fieldset role="group" :aria-invalid="meta.validated && !meta.valid" :aria-describedby="meta.validated && !meta.valid ? 'code-error' : undefined">
			<legend class="sr-only">Verificatiecode invoeren (6 cijfers)</legend>

			<div class="flex justify-center w-full gap-2">
				<label v-for="(digit, idx) in digits" :key="idx" :for="`code-${idx}`" class="flex-1">
					<span class="sr-only">Cijfer {{ idx + 1 }} van 6</span>
					<input
						:id="`code-${idx}`"
						:name="`code-${idx}`"
						ref="inputs"
						type="text"
						inputmode="numeric"
						placeholder="0"
						autocomplete="one-time-code"
						maxlength="1"
						:aria-label="`Cijfer ${idx + 1} van 6`"
						:aria-invalid="meta.validated && !meta.valid"
						:aria-describedby="meta.validated && !meta.valid ? 'code-error' : undefined"
						class="w-full p-3 text-2xl font-medium text-center transition border select-none rounded-xl bg-white/80 placeholder:text-gray-400 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
						:class="
							meta.validated && !meta.valid
								? 'border-red-500 focus:ring-2 focus:ring-red-500/60 focus:border-red-500 text-red-800'
								: 'border-gray-400 focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500 text-gray-900'
						"
						:value="digits[idx]"
						@input="onInput($event, idx)"
						@keydown.backspace="onBackspace($event, idx)"
						@focus="onFocus(idx)"
						@paste="onPaste($event)" />
				</label>
			</div>

			<div v-if="meta.validated && !meta.valid" id="code-error" class="sr-only" role="alert" aria-live="polite">De ingevoerde verificatiecode is ongeldig. Voer een geldige 6-cijferige code in.</div>

			<input type="hidden" name="code" :value="field.value" aria-hidden="true" />
		</fieldset>
	</field>
</template>

<script setup lang="ts">
	const { value } = useField<string>(`code`);

	const digits = ref<string[]>(["", "", "", "", "", ""]);
	const inputs = ref<HTMLInputElement[]>([]);

	watch(value, (newValue) => {
		if (!newValue) {
			digits.value = ["", "", "", "", "", ""];
			inputs.value[0]?.focus();
		}
	});

	const onInput = (e: Event, idx: number) => {
		const input = e.target as HTMLInputElement;
		const val = input.value.replace(/\D/g, "");

		if (!val) {
			digits.value[idx] = "";
			input.value = "";
			return;
		}

		digits.value[idx] = val[0] || "";
		input.value = digits.value[idx];

		if (idx < 5) inputs.value[idx + 1]?.focus();

		const code = digits.value.join("");
		value.value = code;
	};

	const onPaste = (e: ClipboardEvent) => {
		const paste = e.clipboardData?.getData("text") || "";
		const numbers = paste.replace(/\D/g, "").split("").slice(0, 6);

		if (numbers.length === 0) return;

		e.preventDefault();
		for (let i = 0; i < 6; i++) {
			const digit = numbers[i] ?? "";
			digits.value[i] = digit;
			const input = inputs.value[i];
			if (input) input.value = digit;
		}
		value.value = digits.value.join("");
		const nextIdx = numbers.length < 6 ? numbers.length : 5;

		inputs.value[nextIdx]?.focus();
	};

	const onBackspace = (e: KeyboardEvent, idx: number) => {
		if (digits.value[idx] === "" && idx > 0) {
			inputs.value[idx - 1]?.focus();
		}

		const code = digits.value.join("");
		value.value = code;
	};

	const onFocus = (idx: number) => {
		inputs.value[idx]?.select();
	};

	onMounted(() => {
		inputs.value[0]?.focus();
	});
</script>

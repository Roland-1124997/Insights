<template>
	<div>
		<form @click.prevent="props.onConfirm(url)" class="flex items-center justify-center w-full gap-2">
			<div class="relative w-full">
				<label for="paste-url" class="sr-only"> URL invoeren </label>
				<input
					id="paste-url"
					v-model="url"
					type="url"
					placeholder="Voer URL in..."
					class="w-full p-3 pl-10 text-gray-900 transition border rounded-xl bg-white/80 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500/60 disabled:opacity-60 disabled:cursor-not-allowed"
					autocomplete="off"
					spellcheck="true"
					role="searchbox"
					aria-label="Voer URL in" />
				<icon name="akar-icons:link-chain" class="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none left-3 top-1/2" aria-hidden="true" />
			</div>

			<button
				class="flex items-center justify-center gap-2 p-[0.70rem] text-sm font-medium transition-colors duration-200 border rounded-lg outline-none w-fit bg-blue-600 text-blue-200 border-blue-500 hover:bg-blue-700 hover:text-blue-300 focus:text-blue-300 focus:border-blue-600 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
				aria-label="Nieuwe URL toevoegen">
				<icon name="akar-icons:link-chain" class="w-5 h-5" aria-hidden="true" />
				<span class="sr-only"> Voeg toe </span>
			</button>
		</form>

		<div class="p-4 mt-4 space-y-3 rounded-lg bg-gray-50">
			<div class="flex items-center justify-between">
				<span class="text-sm font-medium text-gray-700"> Snelle acties </span>
				<div class="p-1 px-3 text-sm bg-gray-200 rounded-xl">Optioneel</div>
			</div>
			<button @click="pasteFromClipboard" class="flex items-center justify-start w-full gap-2 pl-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 h-9">
				<icon name="akar-icons:copy" size="1.2em"></icon>
				<span class="text-sm font-medium"> Plak uit klembord </span>
			</button>
		</div>
		<div v-if="error" class="mt-1 text-sm font-medium text-gray-700">
			<transition name="fade">
				<div class="py-3 text-red-700">{{ message }}</div>
			</transition>
		</div>
	</div>
</template>

<script lang="ts" setup>
	defineProps<{
		props: Record<string, any>;
	}>();

	const url = ref("");
	const error = ref(false);
	const message = ref("");

	const pasteFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText();

			if (text) {
				url.value = text;
				error.value = false;
			} else {
				error.value = true;
				message.value = "Klembord is leeg. Kopieer eerst de gewenste link.";
			}
		} catch (e) {
			error.value = true;
			message.value = "Automatisch plakken wordt niet ondersteund op jouw apparaat. Klik op het veld en kies 'Plakken'.";
		}
	};
</script>

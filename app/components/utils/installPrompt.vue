<template>
	<Transition enter-active-class="transition duration-300 ease-out" enter-from-class="transform translate-y-[-100%]" enter-to-class="transform translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0" leave-to-class="transform translate-y-[-100%]">
		<div v-if="pwa?.showInstallPrompt" class="relative w-full bg-blue-600 border-b border-blue-800">
			<div class="px-4 mx-auto">
				<div class="flex items-center justify-between py-2">
					<div class="flex items-center flex-1 gap-3">
						<div class="flex items-center justify-center p-1.5 rounded-lg bg-white/10">
							<Icon name="mdi:cellphone-arrow-down" class="w-5 h-5 text-white" />
						</div>
						<div class="flex flex-col">
							<p class="text-xs font-semibold text-white sm:text-sm">Installeer App</p>
							<p class="text-xs text-blue-100">Snellere toegang, offline beschikbaar</p>
						</div>
					</div>

					<div class="flex items-center gap-2 ml-4">
						<button @click="handleInstall" class="px-2 py-1 text-xs font-medium text-blue-600 transition-colors duration-200 bg-white rounded-lg shadow-sm hover:bg-blue-50 sm:text-sm">Installeren</button>
						<button @click="dismissPrompt" class="flex items-center justify-center p-1.5 transition-colors duration-200 rounded-lg text-white/80 hover:text-white hover:bg-white/10" aria-label="Sluiten">
							<Icon name="mdi:close" class="w-4 h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
	const pwa = usePWA();

	const handleInstall = async () => {
		await pwa?.install();
	};

	const dismissPrompt = () => {
		pwa?.cancelInstall()
	};
</script>

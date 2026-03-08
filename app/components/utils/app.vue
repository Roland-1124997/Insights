<template>
	<div :class="!disablePwaPrompt ? 'flex-col' : 'flex'" class="fixed top-0 left-0 flex items-start justify-center w-full h-screen overflow-hidden">
		<ClientOnly>
			<UtilsInstallPrompt v-if="!disablePwaPrompt" />
		</ClientOnly>

		<div class="flex w-full h-full overflow-hidden">
			<slot></slot>
		</div>

		<ClientOnly>
			<UtilsToast />
		</ClientOnly>

		<div class="fixed z-[100] w-screen h-screen pointer-events-none">
			<div class="pointer-events-auto">
				<ClientOnly>
					<Modal />
				</ClientOnly>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		disablePwaPrompt: {
			type: Boolean,
			default: false,
		},
	});
</script>

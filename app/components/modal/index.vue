<template>
	<div>
		<Transition name="modal">
			<section
				v-if="isVisible"
				ref="target"
				:class="hideOnDesktop ? ' md:hidden' : ''"
				class="fixed top-0 left-0 z-50 flex items-end justify-center w-screen h-full bg-black md:justify-center md:items-center bg-opacity-60 backdrop-blur-sm">
				<div tabindex="0" class="mx-6 outline-none md:mb-0 rounded-xl" ref="modal">
					<Transition name="modalDelay">
						<div ref="modalDelay" v-if="isFullyVisible">
							<div class="w-screen max-w-2xl p-5 bg-white min-h-[25vh] h-fit max-h-[95vh] rounded-2xl flex flex-col items-start justify-between">
								<div class="w-full mb-8">
									<div class="flex items-start justify-between w-full">
										<h1 class="text-2xl font-bold text-black truncate text-balance">
											{{ content?.name }}
										</h1>
										<button v-if="!content?.hideCloseButton" class="flex items-center justify-center" aria-label="sluit modal" @click="onclose(content?.props)">
											<Icon name="akar-icons:x-small" size="2em"></Icon>
											<span class="sr-only">Sluit modal</span>
										</button>
									</div>
									<p class="mt-1 text-gray-600">
										{{ content?.description }}
									</p>
								</div>

								<div :class="pwa?.isPWAInstalled ? ' pb-6' : ''" class="w-full" v-if="content">
									<FormHandeler :props="content?.props" :component="content?.component" />
								</div>
							</div>
						</div>
					</Transition>
				</div>
			</section>
		</Transition>
	</div>
</template>

<script setup lang="ts">
	import { useFocusTrap } from "@vueuse/integrations/useFocusTrap";

	const pwa = ref(useNuxtApp().$pwa);

	const modal = ref(null);
	const target = useTemplateRef<HTMLDivElement>("target");

	const { activate, deactivate } = useFocusTrap(target);
	const { hideOnDesktop, content, isVisible, isFullyVisible, close } = useModal();

	watch(isFullyVisible, async (visible) => {
		if (visible) {
			await nextTick();
			activate();
		} else deactivate();
	});

	const onclose = (props: Record<string, any> | undefined) => {
		if (content.value?.hideCloseButton) return;

		if (props && props.onClose) props.onClose();
		else close();
	};

	onClickOutside(modal, () => onclose(content.value?.props));
</script>

<style scoped>
	.modal-enter-active,
	.modal-leave-active {
		transition: all 0.8s ease;
	}

	.modal-enter-from,
	.modal-leave-to {
		opacity: 0;
	}

	.modalDelay-enter-active,
	.modalDelay-leave-active {
		transition: all 1s ease;
	}

	.modalDelay-enter-from,
	.modalDelay-leave-to {
		opacity: 0;
		transform: translateY(12em);
	}
</style>

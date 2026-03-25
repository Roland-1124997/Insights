<template>
	<div
		type="button"
		v-for="inbox in store.messages"
		:key="inbox.id"
		@click="store.selectMessage(inbox)"
		@keydown.enter="store.selectMessage(inbox)"
		:class="[
			'w-full md:p-4 p-3 px-4 text-left mb-2 border cursor-pointer transition-colors duration-150 rounded-lg',
			store.selected?.id == inbox.id ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 hover:bg-gray-100',
		]">
		<div class="flex items-start gap-3 select-none">
			<div class="flex-1">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<div v-if="!inbox.flags.includes('\\Seen')" class="flex-shrink-0 w-4 h-4 text-white bg-blue-500 rounded-full" role="status" aria-label="Ongelezen bericht"></div>
						<div
							v-if="store.messages.filter((message) => message.threadId === inbox.threadId).length > 1"
							class="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
							role="status"
							:aria-label="`${store.messages.filter((m) => m.threadId === inbox.threadId).length} berichten in deze conversatie`">
							<icon name="akar-icons:chat-dots" class="w-3 h-3" aria-hidden="true" />
							<span>{{ store.messages.filter((m) => m.threadId === inbox.threadId).length }}</span>
						</div>
						<h2 class="font-semibold text-gray-900 truncate text-balance">
							{{ inbox.from.name || "Onbekende afzender" }}
						</h2>
					</div>

					<div class="flex items-center gap-3">
						<p class="text-xs text-gray-600 truncate md:text-sm">
							<NuxtTime :datetime="inbox.date" year="2-digit" month="2-digit" day="2-digit" hour="2-digit" minute="2-digit" />
						</p>

						<div class="relative" @click.stop>
							<button
								@click="inbox.showDropdown = !inbox.showDropdown"
								class="flex items-center justify-center w-8 h-8 text-gray-600 transition-colors rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
								:aria-label="`Meer acties voor bericht van ${inbox.from.name || 'Onbekende afzender'}`"
								:aria-expanded="inbox.showDropdown">
								<icon name="humbleicons:dots-horizontal" class="w-5 h-5" aria-hidden="true" />
							</button>

							<div v-if="inbox.showDropdown" class="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-52">
								<button
									v-if="inbox.flags.includes('\\Seen')"
									@click="
										inbox.showDropdown = false;
										store.markAsUnseen(inbox);
									"
									class="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
									<icon name="akar-icons:envelope" size="1.25rem" aria-hidden="true" />
									<span>Markeer als ongelezen</span>
								</button>
								<button
									v-else
									@click="
										inbox.showDropdown = false;
										store.markAsSeen(inbox);
									"
									class="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:bg-gray-100">
									<icon name="akar-icons:open-envelope" size="1.25rem" aria-hidden="true" />
									<span>Markeer als gelezen</span>
								</button>
								<button
									@click="
										inbox.showDropdown = false;
										store.deleteMessage(inbox);
									"
									class="flex items-center w-full gap-2 px-3 py-2 text-sm text-left text-red-600 transition-colors border-t border-gray-200 hover:bg-red-50 focus:outline-none focus:bg-red-50">
									<icon name="akar-icons:trash-can" size="1.25rem" aria-hidden="true" />
									<span>Prullenbak</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				<p class="text-sm font-medium text-gray-600 text-balance line-clamp-2">
					{{ inbox.subject || "(Geen onderwerp)" }}
				</p>

				<p :class="store.selected?.id == inbox.id ? 'text-blue-950' : 'text-gray-700'" class="text-sm leading-relaxed line-clamp-2">
					{{ inbox.preview || "Geen preview beschikbaar" }}
				</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const store = useNotifications();
</script>

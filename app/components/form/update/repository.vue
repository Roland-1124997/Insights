<template>
	<div class="w-full h-full">
		<div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
			<h2 class="mb-1 font-semibold text-gray-700 text">Bevestig deze actie</h2>

			<div class="flex flex-col gap-3 mt-5 sm:flex-row">
				<button
					@click="props.onUpdate"
					aria-label="Bevestigen"
					class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60">
					<span class="inline-flex items-center gap-2">
						<Icon name="akar-icons:check" />
						{{ props.message.confirm }}
					</span>
				</button>

				<button
					@click="props.onChange"
					class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-blue-600 transition border border-blue-600 hover:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
					<span class="inline-flex items-center gap-2">
						<Icon name="akar-icons:cross" />
						{{ props.message.change }}
					</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	defineProps<{
		props: Record<string, any>;
	}>();
</script>

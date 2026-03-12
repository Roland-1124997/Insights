<template>
	<div>
		<ClientOnly v-if="metrics && data.length >= 1">
			<div class="pt-3 overflow-hidden">
				<div class="">
					<LazyChartsWorldmap :data="data" :zoom-extent="[2.6, 45]" />
				</div>
			</div>

			<template #fallback>
				<div aria-hidden class="pt-3 animate-pulse">
					<div class="md:hidden h-[400px] bg-gray-200 rounded-lg"></div>
					<div class="hidden h-[520px] bg-gray-200 rounded-lg md:flex"></div>
				</div>
			</template>
		</ClientOnly>

		<template v-else>
			<div aria-hidden class="pt-3 animate-pulse">
				<div class="md:hidden h-[400px] bg-gray-200 rounded-lg"></div>
				<div class="hidden h-[520px] bg-gray-200 rounded-lg md:flex"></div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		metrics: object;
		data: Array<{
			label: string;
		}>;
	}>();
</script>

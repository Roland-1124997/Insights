<template>
	<div>
		<ClientOnly v-if="metrics && data.values.length >= 1">
			<div class="md:hidden">
				<ChartsGroup :data="data?.values?.slice(0, 3) || []" :categories="data.categories" :height="250" :y_axis="['bezoekers', 'weergaven', 'bezoeken']" />
			</div>

			<div class="hidden md:block">
				<ChartsGroup :data="data?.values?.slice(0, 5) || []" :categories="data.categories" :height="410" :y_axis="['bezoekers', 'weergaven', 'bezoeken']" />
			</div>

			<template #fallback>
				<div aria-hidden class="flex flex-col gap-3 h-[248px] mt-10 md:h-[388px] animate-pulse">
					<div class="flex h-full gap-2">
						<div class="flex-1 bg-gray-200 rounded"></div>
						<div class="flex-1 bg-gray-200 rounded"></div>
						<div class="flex-1 bg-gray-200 rounded"></div>
						<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
						<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
					</div>
				</div>
			</template>
		</ClientOnly>

		<template v-else>
			<div aria-hidden class="flex flex-col gap-3 h-[248px] mt-10 md:h-[388px] animate-pulse">
				<div class="flex h-full gap-2">
					<div class="flex-1 bg-gray-200 rounded"></div>
					<div class="flex-1 bg-gray-200 rounded"></div>
					<div class="flex-1 bg-gray-200 rounded"></div>
					<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
					<div class="flex-1 hidden bg-gray-200 rounded md:flex"></div>
				</div>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
	defineProps<{
		metrics: object;
		data: {
			categories: Record<string, { name: string; color: string }>;
			values: number[][];
		};
	}>();
</script>

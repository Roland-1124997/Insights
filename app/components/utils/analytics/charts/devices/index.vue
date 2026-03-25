<template>
	<div>
		<nav class="flex items-center w-full mb-3 overflow-x-auto border-b border-gray-200">
			<button
				type="button"
				@click="updateActiveDevice('bezoekers')"
				:class="[' text-left py-2 w-full text-sm font-medium transition-all whitespace-nowrap relative', activedDevice === 'bezoekers' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900']">
				Bezoekers
				<span v-if="activedDevice === 'bezoekers'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
			</button>
			<button
				type="button"
				@click="updateActiveDevice('bezoeken')"
				:class="['px-4 w-full py-2 text-sm font-medium transition-all whitespace-nowrap relative', activedDevice === 'bezoeken' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900']">
				Bezoeken
				<span v-if="activedDevice === 'bezoeken'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
			</button>
			<button
				type="button"
				@click="updateActiveDevice('weergaven')"
				:class="[' text-right w-full py-2 text-sm font-medium transition-all whitespace-nowrap relative', activedDevice === 'weergaven' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900']">
				Weergaven
				<span v-if="activedDevice === 'weergaven'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
			</button>
		</nav>

		<ClientOnly v-if="metrics && data.values.length >= 1">
			<ChartsDonut :active="activedDevice" :data="data?.values" :categories="data.categories" :height="300" :arc-width="40" />
			<template #fallback>
				<div aria-hidden class="flex items-center justify-center mt-16 h-[300px]">
					<div class="relative w-[19rem] h-[19rem]">
						<div class="absolute inset-0 flex flex-col items-center justify-center gap-2">
							<div class="w-20 h-4 bg-gray-300 rounded-md"></div>
							<div class="w-10 h-4 bg-gray-200 rounded-md"></div>
						</div>
						<div class="absolute inset-0 border-[40px] border-gray-200 rounded-full"></div>
						<div class="absolute inset-0 border-[40px] rounded-full border-t-gray-300 animate-spin"></div>
					</div>
				</div>
			</template>
		</ClientOnly>

		<template v-else>
			<div aria-hidden class="flex items-center justify-center mt-16 h-[300px]">
				<div class="relative w-[19rem] h-[19rem]">
					<div class="absolute inset-0 flex flex-col items-center justify-center gap-2">
						<div class="w-20 h-4 bg-gray-300 rounded-md"></div>
						<div class="w-10 h-4 bg-gray-200 rounded-md"></div>
					</div>
					<div class="absolute inset-0 border-[40px] border-gray-200 rounded-full"></div>
					<div class="absolute inset-0 border-[40px] rounded-full border-t-gray-300 animate-spin"></div>
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

	const activedDevice = ref("bezoekers");
	const updateActiveDevice = (device: string) => {
		activedDevice.value = device;
	};
</script>

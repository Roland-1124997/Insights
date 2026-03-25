<template>
	<div
		v-for="n in 4"
		:key="n"
		class="w-full h-[7.7rem] md:h-[8.15rem] md:p-4 p-3 px-4 text-left mb-2 border transition-colors duration-150 rounded-lg bg-gray-50 animate-pulse flex flex-col justify-between">
		<div class="flex items-start gap-3 mt-1 select-none">
			<div class="flex-1">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<div class="flex-shrink-0 w-4 h-4 bg-blue-200 rounded-full"></div>
						<div class="h-5 bg-blue-100 rounded-full w-14"></div>
						<div class="w-20 h-4 bg-gray-200 rounded"></div>
					</div>
					<div class="flex items-center gap-3">
						<div class="w-16 h-4 bg-gray-200 rounded"></div>
						<div class="w-8 h-4 bg-gray-200 rounded"></div>
					</div>
				</div>
				<div class="w-40 h-4 mt-2 bg-gray-200 rounded"></div>
				<div class="w-3/4 h-4 mt-2 bg-gray-200 rounded"></div>
				<div class="w-8/12 h-4 mt-2 bg-gray-200 rounded"></div>
			</div>
		</div>
	</div>
</template>

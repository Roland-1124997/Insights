<template>
	<div class="pb-[5.5rem] md:pb-0">
		<div class="space-y-3">
			
			<div class="sticky top-0 z-20 flex items-center justify-between px-4 py-2 mb-3 border rounded-lg bg-blue-50 w-fit md:px-4 animate-pulse">
				<div class="w-24 h-5 bg-blue-200 rounded"></div>
			</div>

			
			<div class="space-y-3">
				<div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg w-fit animate-pulse">
					<div class="w-4 h-4 bg-gray-200 rounded"></div>
					<div class="w-20 h-3 bg-gray-200 rounded"></div>
					<div class="w-3 h-3 bg-gray-100 rounded"></div>
					<div class="w-12 h-3 bg-gray-100 rounded"></div>
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					<div v-for="i in 2" :key="'group1-' + i" class="z-10 flex items-center w-full h-[4.95rem] gap-3 p-3 bg-white border border-gray-200 rounded-lg animate-pulse">
						<div class="flex-shrink-0">
							<div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg"></div>
						</div>
						<div class="flex items-start justify-between w-full gap-3">
							<div class="flex-1 overflow-hidden">
								<div class="w-32 h-4 mb-2 bg-gray-200 rounded"></div>
								<div class="flex items-center gap-1 mb-1">
									<div class="w-12 h-3 bg-gray-100 rounded"></div>
									<div class="w-3 h-3 bg-gray-100 rounded"></div>
									<div class="w-10 h-3 bg-gray-100 rounded"></div>
								</div>
								<div class="w-24 h-3 bg-gray-100 rounded"></div>
							</div>
							<div class="flex flex-shrink-0 gap-x-1">
								<div v-for="j in 3" :key="'group1-btn-' + j" class="w-6 h-6 bg-gray-100 rounded-lg"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			
			<div class="space-y-3">
				<div class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg w-fit animate-pulse">
					<div class="w-4 h-4 bg-gray-200 rounded"></div>
					<div class="w-20 h-3 bg-gray-200 rounded"></div>
					<div class="w-3 h-3 bg-gray-100 rounded"></div>
					<div class="w-12 h-3 bg-gray-100 rounded"></div>
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					<div v-for="i in 4" :key="'group2-' + i" class="z-10 h-[4.95rem] flex items-center w-full gap-3 p-3 bg-white border border-gray-200 rounded-lg animate-pulse">
						<div class="flex-shrink-0">
							<div class="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg"></div>
						</div>
						<div class="flex items-start justify-between w-full gap-3">
							<div class="flex-1 overflow-hidden">
								<div class="w-32 h-4 mb-2 bg-gray-200 rounded"></div>
								<div class="flex items-center gap-1 mb-1">
									<div class="w-12 h-3 bg-gray-100 rounded"></div>
									<div class="w-3 h-3 bg-gray-100 rounded"></div>
									<div class="w-10 h-3 bg-gray-100 rounded"></div>
								</div>
								<div class="w-24 h-3 bg-gray-100 rounded"></div>
							</div>
							<div class="flex flex-shrink-0 gap-x-1">
								<div v-for="j in 4" :key="'group1-btn-' + j" class="w-5 h-5 bg-gray-100 rounded"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

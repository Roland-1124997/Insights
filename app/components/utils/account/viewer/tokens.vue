<template>
	<section class="grid w-full grid-cols-1 mt-3 gap-y-3 md:gap-3 md:grid-cols-2 h-fit pb-[5.5rem] md:pb-0">
		<article class="w-full col-span-1 p-6 border rounded-lg md:col-span-2">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h2 class="text-xl font-bold text-gray-900">Actieve sleutels</h2>
					<p class="mt-1 text-sm text-gray-600">
						{{ data.values.length || 0 }} actieve
						{{ data.values.length === 1 ? "sleutel" : "sleutels" }}
					</p>
				</div>

				<UtilsButtonImportant description="maak nieuwe token aan" icon-name="akar-icons:edit" @click="security.Create()" />
			</div>

			<div>
				<UtilsTable name="tokens" :data="data.values" :categories="data.categories" :actions />
			</div>
		</article>
	</section>
</template>

<script setup lang="ts">
	defineProps({
		data: {
			type: Object as PropType<{ values: TableRowKeys[]; categories: { label: string; value: string }[] }>,
			required: true,
		},
	});

	const security = useSecurity();

	const actions = [
		{
			name: "bekijken",
			icon: "akar-icons:eye",
			color: "gray-800",
			action: (row: any) => {
				security.show(row);
			},
		},
		{
			name: "Verwijderen",
			icon: "akar-icons:trash-can",
			color: "red-600",
			action: (row: any) => {
				security.Delete(row);
			},
		},
	];
</script>

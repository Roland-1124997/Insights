<template>
	<div>
		<UtilsTable :name :data="data?.slice(0, visable) || []" :categories :isSmall :isOpen :visable :loading />
	</div>
</template>

<script setup lang="ts">
	const { name } = defineProps<{
		isSmall?: boolean;
		isOpen?: boolean;
		visable: number;
		data: [
			{
				label: string;
				weergaven: number;
				bezoekers: number;
				bezoeken: number;
				bounces: number;
				totaltime: number;
			},
		];
		name: "pages" | "countries" | "devices";
		loading?: boolean;
	}>();

	const categories = [
		{
			label: name === "pages" ? "Pagina" : name === "countries" ? "Land" : "Apparaat",
			value: "label",
		},
		{
			label: "Weergaven",
			value: "weergaven",
		},
		{
			label: "Bezoekers",
			value: "bezoekers",
		},
		{
			label: "Bezoeken",
			value: "bezoeken",
		},
		{
			label: "Bounces",
			value: "bounces",
		},
		{
			label: "Sessie duur",
			value: "totaltime",
		},
	];
</script>

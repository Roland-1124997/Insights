<template>
	<div class="flex flex-col items-center justify-center h-full p-8 text-gray-500 bg-white">
		<icon name="akar-icons:inbox" class="w-16 h-16 mb-4 text-gray-300" aria-hidden="true" />
		<h2 class="mb-1 text-lg font-medium">Geen berichten</h2>
		<p class="text-sm text-center">
			{{ displayMessage() }}
		</p>
	</div>
</template>

<script setup lang="ts">
	const { search } = useSearch();
	const { filter } = useFilter();

	const displayMessage = () => {
		if (filter.value) {
			const seen = filter.value === "gelezen";
			const unseen = filter.value === "ongelezen";

			if (seen) return `Er zijn momenteel geen gelezen berichten`;
			else if (unseen) return `Er zijn momenteel geen ongelezen berichten`;
			else {
				if (search.value) return "Probeer een andere zoekterm";
				else return `Er zijn momenteel geen berichten`;
			}
		}

		return "Probeer een andere zoekterm";
	};
</script>

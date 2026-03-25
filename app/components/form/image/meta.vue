<template>
	<div class="w-full h-full">
		<Form @submit="props.onConfirm" :validation-schema="schema.fileMeta.frontend" v-slot="{ errors, meta }" class="flex flex-col max-h-[64vh]">
			<div class="grid gap-6 p-1 overflow-y-auto bg-white md:grid-cols-2">
				<div class="space-y-2">
					<p class="text-sm font-medium text-gray-700 col-span-full">Voorbeeld van de afbeelding:</p>
					<img :src="props.content.src" alt="Image Preview" class="object-cover w-full mx-auto border rounded-lg h-fit aspect-video" />
				</div>

				<div class="flex flex-col justify-between w-full space-y-6">
					<div class="space-y-6">
						<div class="space-y-1">
							<UtilsInput
								:initial-value="props.content.title"
								iconName="akar-icons:text-align-left"
								name="title"
								label="Bijschrift"
								placeholder="Voeg een bijschrift toe voor deze afbeelding"
								:required="true" />
							<p class="text-xs text-gray-500 pl-0.5">Deze tekst wordt onder de afbeelding weergegeven</p>
						</div>

						<div class="space-y-1">
							<UtilsInputArea :initial-value="props.content.alt" name="alt" label="Alternatieve tekst" placeholder="Beschrijf wat er te zien is op de afbeelding" :required="true" />
							<p class="text-xs text-gray-500 pl-0.5">Helpt met toegankelijkheid en SEO</p>
						</div>
					</div>
				</div>
			</div>

			<button
				type="submit"
				class="flex mt-3 items-center justify-center w-full gap-2.5 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 bg-blue-600 border-blue-600 rounded-xl outline-none select-none hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
				<icon name="akar-icons:save" class="w-5 h-5" aria-hidden="true" />
				<span>Opslaan</span>
			</button>
		</Form>
	</div>
</template>

<script lang="ts" setup>
	defineProps<{
		props: Record<string, any>;
	}>();
</script>

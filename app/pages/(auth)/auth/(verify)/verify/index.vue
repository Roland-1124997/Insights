<template>
	<div class="relative">
		<div class="relative w-full max-w-lg mx-auto">
			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Twee-factor authenticatie</h1>
				<p class="text-sm text-gray-600 md:text-base">Voer de 6-cijferige code in vanuit je authenticator app om toegang te krijgen tot je account.</p>
			</div>

			<FormBase :schema="schema.totp.frontend" :request v-slot="{ loading, errors }" class="mt-10">
				<UtilsInputTopt />

				<div class="fixed bottom-0 left-0 w-full px-6 pt-6 pb-10 bg-white border-t md:relative md:px-0 md:bg-transparent md:border-0 md:py-0">
					<button
						type="submit"
						:disabled="loading"
						class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
						<span v-if="!loading" class="inline-flex items-center gap-2">
							<Icon name="akar-icons:circle-chevron-right-fill" />
							Verifiëren
						</span>
						<span v-else class="inline-flex items-center gap-2">
							<Icon name="akar-icons:arrow-cycle" class="animate-spin" />
							Bezig met verifiëren…
						</span>
					</button>

					<button
						type="button"
						@click="store.logout"
						class="inline-flex items-center justify-center w-full gap-2 px-4 py-3 mt-3 text-gray-700 transition bg-gray-100 hover:bg-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400">
						<Icon name="akar-icons:arrow-left" />
						Terug naar login
					</button>
				</div>

				<div class="p-4 mt-8 border border-blue-200 rounded-xl bg-blue-50">
					<div class="flex gap-3">
						<div class="flex-shrink-0">
							<Icon name="akar-icons:info" class="w-5 h-5 text-blue-600" />
						</div>
						<div class="text-sm text-gray-700">
							<p class="font-medium text-blue-900">Geen toegang tot je authenticator?</p>
							<p class="mt-1">Gebruik een backup code of neem contact op met support voor hulp bij het herstellen van je account.</p>
						</div>
					</div>
				</div>
			</FormBase>
		</div>
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights - Verificatie",
		description: "Verifieer je identiteit met een authenticatie code.",
		ogTitle: "Insights - Verificatie",
		ogDescription: "Verifieer je identiteit met een authenticatie code.",
		ogUrl: "/auth/verify",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights - Verificatie",
		twitterDescription: "Verifieer je identiteit met een authenticatie code.",
		twitterImage: "/icons/icon_512-blue.png",
		twitterCard: "app",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/png",
				href: "/icons/icon_512-blue.png",
			},
		],
	});

	const store = useSessions();

	const request: requestOptions = {
		url: "/api/auth/totp/verify",
		method: "POST",
		successMessage: "Code succesvol geverifieerd! Je wordt doorgestuurd...",
		onfailure: async (error: ErrorResponse, actions) => {
			const details = error.details as Record<string, string>;

			actions.setErrors(details);

			await new Promise((resolve) => setTimeout(resolve, 3000));
			actions.resetForm();
		},
	};
</script>

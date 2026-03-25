<template>
	<div class="relative">
		<div class="relative w-full max-w-lg mx-auto">
			<div class="space-y-2">
				<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Krijg toegang tot je account</h1>
				<p class="text-sm text-gray-600 md:text-base">Vul hieronder je e-mailadres en wachtwoord in om toegang te krijgen tot je account.</p>
			</div>

			<FormBase :schema="schema.login.frontend" :request v-slot="{ loading }" class="mt-10">
				<UtilsInput name="email" label="E-mailadres" icon-name="akar-icons:envelope" type="email" placeholder="you@company.com" :required="true" :disabled="loading" />

				<UtilsInput name="password" label="Wachtwoord" icon-name="akar-icons:lock-on" type="password" placeholder="••••••••" :disabled="loading" :required="true" />

				<div class="fixed bottom-0 left-0 w-full px-6 pt-6 pb-10 bg-white border-t md:relative md:px-0 md:bg-transparent md:border-0 md:py-0">
					<button
						type="submit"
						:disabled="loading"
						class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
						<span v-if="!loading" class="inline-flex items-center gap-2">
							<Icon name="akar-icons:circle-chevron-right-fill" />
							Inloggen
						</span>
						<span v-else class="inline-flex items-center gap-2">
							<Icon name="akar-icons:arrow-cycle" class="animate-spin" />
							Bezig met inloggen…
						</span>
					</button>
				</div>
			</FormBase>
		</div>
	</div>
</template>

<script setup lang="ts">
	useSeoMeta({
		title: "Insights",
		description: "Welkom terug! Log in om door te gaan naar je dashboard.",
		ogTitle: "Insights",
		ogDescription: "Welkom terug! Log in om door te gaan naar je dashboard.",
		ogUrl: "/",
		ogImage: "/icons/icon_512-blue.png",
		twitterTitle: "Insights",
		twitterDescription: "Welkom terug! Log in om door te gaan naar je dashboard.",
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

	const request: requestOptions = {
		url: "/api/auth",
		method: "POST",
		successMessage: "Je bent succesvol ingelogd! en wordt doorgestuurd...",
		onsuccess: async () => {
			const ipRequest = useApiHandler<{ ip: string }>("https://api.ipify.org?format=json");

			const { data, error } = await ipRequest.Get();
			if (error || !data) return;

			const {
				screen: { width, height },
				navigator: { language },
			} = window;

			const request = useApiHandler("/api/auth/account/sessions");

			request.Post({
				body: {
					screen: `${width}x${height}`,
					language,
					ip: data.ip,
				},
			});
		},
	};
</script>

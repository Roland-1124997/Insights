<template>
	<div class="overflow-scroll max-h-[60vh]">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<div v-if="props.content.totp.qr_code" class="flex flex-col items-center space-y-4">
				<div class="p-4 bg-white border border-gray-200 rounded-lg md:p-6">
					<img :src="props.content.totp.qr_code" alt="QR Code" class="w-[20rem] md:w-64 md:h-64 h-fit" />
				</div>
			</div>

			<div class="space-y-4">
				<div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
					<h2 class="mb-1 text-sm font-semibold text-gray-700">Handmatige configuratie</h2>
					<p class="mb-3 text-xs text-gray-600">Kun je de QR-code niet scannen? Gebruik deze sleutel:</p>

					<div class="flex items-center gap-2">
						<a :href="props.content.totp.uri" class="flex-1 px-2 py-3 font-mono text-xs text-center bg-white border border-gray-300 rounded">
							{{ props.content.totp.secret }}
						</a>
						<UtilsButtonImportant @click="copyToClipboard(props.content.totp.secret)" icon-name="akar-icons:copy" description="kopieer code handmatig" :isButton="true" :isSmall="false" />
					</div>
				</div>

				<div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
					<h2 class="mb-1 text-sm font-semibold text-gray-700">Verifieer je authenticatie-app</h2>
					<p class="mb-3 text-xs text-gray-600">Voer de 6-cijferige code in die je authenticator-app genereert om de installatie te voltooien.</p>

					<FormBase :schema="schema.totp.frontend" :request v-slot="{ loading, errors }">
						<div class="mt-6">
							<UtilsInputTopt />
						</div>

						<button
							type="submit"
							:disabled="loading"
							class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 mt-4 text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
							<span v-if="!loading" class="inline-flex items-center gap-2">
								<Icon name="akar-icons:check" />
								Voltooien
							</span>
							<span v-else class="inline-flex items-center gap-2">
								<Icon name="akar-icons:arrow-cycle" class="animate-spin" />
								Bezig met verifiëren…
							</span>
						</button>
					</FormBase>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
	const { props } = defineProps<{
		props: Record<string, any>;
	}>();

	const request: requestOptions = {
		url: "/api/auth/totp/verify?context=setup",
		method: "POST",
		successMessage: "Code succesvol geverifieerd! Je wordt doorgestuurd...",

		onsuccess: async () => {
			await props.onComplete();
		},

		onfailure: async (error, actions) => {
			const details = error.details as Record<string, string>;

			actions.setErrors(details);

			await new Promise((resolve) => setTimeout(resolve, 3000));
			actions.resetForm();
		},
	};

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error("Failed to copy: ", err);
		}
	};
</script>

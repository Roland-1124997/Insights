<template>
	<div class="w-full">
		<FormBase :schema="validationSchema" :request v-slot="{ loading, errors }">
			<div class="p-4 border border-gray-200 rounded-lg bg-gray-50">
				<h2 class="mb-1 font-semibold text-gray-700 text">Bevestig deze actie</h2>
				<p class="mb-3 text-sm text-gray-600">
					<span v-if="verified && props.request.secure"> Om deze actie te bevestigen, voer je de 6-cijferige code in van je authenticator-app. </span>
					<span v-else> Klik op bevestigen om deze actie uit te voeren. </span>
				</p>

				<div v-if="verified && props.request.secure" class="w-full mt-6">
					<UtilsInputTopt />
				</div>

				<div class="flex flex-col gap-3 mt-5 sm:flex-row">
					<button
						type="submit"
						:disabled="loading"
						aria-label="Bevestigen"
						class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-white transition bg-red-600 hover:bg-red-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-60">
						<span v-if="!loading" class="inline-flex items-center gap-2">
							<Icon name="akar-icons:check" />
							{{ props.message.confirm }}
						</span>
						<span v-else class="inline-flex items-center gap-2">
							<Icon name="akar-icons:arrow-cycle" class="animate-spin" />
							Bezig met verifiëren…
						</span>
					</button>

					<button
						:disabled="loading"
						type="button"
						@click.stop="props.onCancel()"
						class="relative inline-flex items-center justify-center w-full gap-2 px-4 py-3 text-blue-600 transition border border-blue-600 hover:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
						<span class="inline-flex items-center gap-2">
							<Icon name="akar-icons:cross" />
							{{ props.message.cancel }}
						</span>
					</button>
				</div>
			</div>
		</FormBase>
	</div>
</template>

<script lang="ts" setup>
	const session = useSessions();
	const verified = ref();

	const { data } = await session.getSession();

	verified.value = data.data.factors.verified;

	const { props } = defineProps<{
		props: Record<string, any>;
	}>();

	const validationSchema = computed(() => {
		return verified.value && props.request.secure ? schema.totp.frontend : schema.totp.optional.frontend;
	}) as any;

	const request: requestOptions = {
		url: props.request.url,
		method: props.request.method,
		successMessage: props.message.success,

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
</script>

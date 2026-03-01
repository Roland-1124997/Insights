<template>
	<ClientOnly>
		<VitePwaManifest />
	</ClientOnly>
	<NuxtRouteAnnouncer />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">

  const { syncSubscription } = await usePush()

	onMounted(async () => {
    await syncSubscription();
	});
</script>

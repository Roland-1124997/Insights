<template>
	<template v-if="component == 'FormSelect'">
		<FormSelect :props="props" />
	</template>

	<template v-else-if="component == 'FormInputUrl'">
		<FormInputUrl :props="props" />
	</template>

	<template v-else-if="component == 'Confirm'">
		<FormSelectChoices :props="props" />
	</template>

	<template v-else-if="component == 'Email'">
		<FormEmailPreview :props="props" />
	</template>

	<template v-else-if="component == 'Totp'">
		<FormToptSetup :props="props" />
	</template>

	<template v-else-if="component == 'ImageMeta'">
		<FormImageMeta :props="props" />
	</template>

	<template v-else-if="component == 'UpdateForm'">
		<FormUpdateRepository :props="props" />
	</template>

	<template v-else-if="component == 'CreateTokenForm'">
		<FormTokenCreate :props="props" />
	</template>

	<template v-else-if="component == 'showToken'">
		<FormTokenShow :props="props" />
	</template>
</template>

<script lang="ts" setup>
	const { props, component } = defineProps<{
		props: Record<string, any>;
		component: string;
	}>();
</script>

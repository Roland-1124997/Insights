const isTableEnabled = ref<boolean>(false);

export const useTable = () => {
	const router = useRouter();
	const route = useRoute();

	isTableEnabled.value = (route.query.table as string) === "true" ? true : false;

	const togleTable = () => {
		isTableEnabled.value = !isTableEnabled.value;

		const query = { ...route.query };

		if (isTableEnabled.value) {
			query.table = "true";
		} else {
			delete query.table;
		}

		router.replace({ query }).catch(() => {});
	};

	return {
		isTableEnabled,
		togleTable,
	};
};

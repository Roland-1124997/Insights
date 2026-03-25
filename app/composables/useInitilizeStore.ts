export const useInitilizeStore = async (toolbar: ToolBar, params: { filter?: string; page?: number }) => {
	if (import.meta.server) return;

	const storeName = toolbar?.store;
	await useRefreshCurrentStore(storeName, params);
};

export const useRefreshCurrentStore = async (storeName: string | undefined, params?: { filter?: string; page?: number }) => {
	if (!storeName) return;

	const currentStore = useCurrentStore(storeName);
	if (currentStore && currentStore.refresh) await currentStore.refresh(params);
};

export const useCurrentStore = (storeName: string) => {
	const pinia = useNuxtApp().$pinia;
	const currentStore = (pinia as any)._s.get(storeName) as StoreType;

	return currentStore;
};

export const useRouterStore = (storeName: string | undefined) => {
	if (!storeName) return null;
	return useCurrentStore(storeName);
};

export const useAlertCount = (storeName: string | undefined, format: boolean = false) => {
	const store = useRouterStore(storeName);
	const count = store?.alert?.value ?? 0;

	if (format) return count > 99 ? "99+" : String(count);
	return count;
};

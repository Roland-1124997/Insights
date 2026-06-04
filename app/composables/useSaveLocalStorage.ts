export const useSaveLocalStorage = (name: string, payload: any) => {
	// due a node js 25 bug, we need to check if we are on the client before using localStorage
	return import.meta.client ? useLocalStorage<string | null>(name, payload) : ref<string | null>(null);
};

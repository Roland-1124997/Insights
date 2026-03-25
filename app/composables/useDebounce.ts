export const useDebounce = () => {
	let timeout: NodeJS.Timeout | null = null;

	const wait = (callback: Function, wait: number) => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => callback(), wait);
	};

	return { wait };
};

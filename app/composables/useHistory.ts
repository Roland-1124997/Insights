const history: RouteHistory = {};

export const useHistory = () => {
	const clearHistory = (path: string) => {
		history[path] = [];
	};

	const getHistory = (path: string): HistoryEntry[] => {
		return history[path] || [];
	};

	const getHistoryLastEntry = (path: string): HistoryEntry | null => {
		return getHistory(path)[0] || null;
	};

	const setHistory = (path: string, entries: HistoryEntry[]) => {
		history[path] = entries;
	};

	return {
		clear: clearHistory,
		get: getHistory,
		LastEntry: getHistoryLastEntry,
		set: setHistory,
	};
};

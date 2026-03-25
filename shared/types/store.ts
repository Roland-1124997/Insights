import type { Store } from "pinia";
import type { ErrorResponse } from "./api";

export type StoreType = Store<
	string,
	{
		refresh?: (params?: { filter?: string; page?: number; search?: string }) => Promise<void>;
		alert?: { value: number };
		loading: boolean;
		error: ErrorResponse | null;
	}
>;

export type HistoryEntry = {
	search?: string | null;
	filter: string | null;
	page?: string | number | null;
};

export type RouteHistory = Record<string, HistoryEntry[]>;

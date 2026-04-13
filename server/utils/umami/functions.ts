import { start } from "repl";

const { UMAMI_API_KEY, production } = useRuntimeConfig();

const headers = { "x-umami-api-key": UMAMI_API_KEY };
const baseUrl = `https://api.umami.is/v1/websites/d10b0ef2-b433-4f78-8f78-724e711e541a`;

export const useFetchMetrics = defineCachedFunction(
	async (key: string, query: AnalyticsQuery) => {
		const url = `${baseUrl}/metrics/expanded`;

		let data: Record<string, any> | null = null;
		let error = null;

		try {
			data = await $fetch<Record<string, any>>(url, { headers, query });
		} catch (err) {
			error = err;
		}

		return { data, error };
	},
	{
		maxAge: 60 * 60 * 24 * 1,
		name: "analytics",
		getKey: (key: string, query: AnalyticsQuery) => `${key}-${query.timezone.split("/").join("-")}`,
	},
);

export const useFetchAnalytics = defineCachedFunction(
	async (key: string, query: AnalyticsQuery) => {
		const url = `${baseUrl}/stats`;

		let data: Record<string, any> | null = null;
		let error = null;

		try {
			data = await $fetch<Record<string, any>>(url, { headers, query });
		} catch (err) {
			error = err;
		}

		return { data, error };
	},
	{
		maxAge: 60 * 10,
		name: "analytics",
		getKey: (key: string, query: AnalyticsQuery) => `${key}-${query.timezone.split("/").join("-")}`,
	},
);

const setReferenceDate = (filter: "dag" | "week" | "maand" | "jaar", previous: boolean) => {
	const timezone = "Europe/Amsterdam";
	const nowDate = new Date(new Date().toLocaleString("en-US", { timeZone: timezone }));

	const referenceDate = new Date(nowDate);

	if (previous) {
		if (filter === "week") referenceDate.setDate(referenceDate.getDate() - 7);
		else if (filter === "maand") referenceDate.setMonth(referenceDate.getMonth() - 1);
		else if (filter === "jaar") referenceDate.setFullYear(referenceDate.getFullYear() - 1);
		else referenceDate.setDate(referenceDate.getDate() - 1);
	}

	return {
		year: referenceDate.getFullYear(),
		month: referenceDate.getMonth(),
		day: referenceDate.getDate(),
	};
};

const calculateStartAndEndDates = (filter: "dag" | "week" | "maand" | "jaar", year: number, month: number, day: number) => {
	let startAt = new Date(year, month, day, 0, 0, 0, 0).getTime();
	let endAt = new Date(year, month, day, 23, 59, 59, 999).getTime();

	if (filter === "week") {
		const currentDate = new Date(year, month, day);
		// getDay(): sunday = 0, monday = 1, ..., saturday = 6
		const mondayBasedDay = (currentDate.getDay() + 6) % 7;
		const weekStartDate = new Date(year, month, day - mondayBasedDay, 0, 0, 0, 0);
		const weekEndDate = new Date(weekStartDate);

		weekEndDate.setDate(weekStartDate.getDate() + 6);
		weekEndDate.setHours(23, 59, 59, 999);

		startAt = weekStartDate.getTime();
		endAt = weekEndDate.getTime();
	}

	if (filter === "maand") {
		startAt = new Date(year, month, 1, 0, 0, 0, 0).getTime();
		endAt = new Date(year, month + 1, 0, 23, 59, 59, 999).getTime();
	}

	if (filter === "jaar") {
		startAt = new Date(year, 0, 1, 0, 0, 0, 0).getTime();
		endAt = new Date(year, 11, 31, 23, 59, 59, 999).getTime();
	}

	return { startAt, endAt };
};

export const formulateDates = (filter: "dag" | "week" | "maand" | "jaar", previous: boolean) => {
	const { year, month, day } = setReferenceDate(filter, previous);
	return calculateStartAndEndDates(filter, year, month, day);
};

export const calculateMetrics = (metrics: Record<string, any>) => {
	const result: Record<string, any> = metrics.map((item: Record<string, any>) => {
		const label = item.name == "/" ? "/index" : item.name;

		return {
			label: label.charAt(0).toUpperCase() + label.slice(1),
			weergaven: item.pageviews,
			bezoekers: item.visitors,
			bezoeken: item.visits,
			bounces: ((item.bounces / item.visits) * 100).toFixed(0),
			totaltime: item.totaltime / item.visits,
		};
	});

	result.sort((a: Record<string, any>, b: Record<string, any>) => b.weergaven - a.weergaven);

	return result;
};

export const calculateValues = (options: { label: string; value: number; previous: number; color: string; icon: string; format: boolean }) => {
	const difference = calculateDifference(options.value, options.previous);
	const percentage = calculatePercentage(options.value, options.previous);
	const isPositive = positivePercentage(Number(percentage));

	return {
		label: options.label,
		value: options.value,
		difference: difference,
		percentage: percentage,
		positive: isPositive,
		color: options.color,
		icon: options.icon,
		format: options.format,
	};
};

export const positivePercentage = (value: number) => {
	if (value > 0) return true;
	return false;
};

export const calculateDifference = (current: number, previous: number, time: boolean = false) => {
	if (time) return (current - previous) / 10;
	return current - previous;
};

export const calculatePercentage = (current: number, previous: number) => {
	if (previous === 0) return 100;
	return (((current - previous) / previous) * 100).toFixed(0);
};

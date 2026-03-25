export const useFormatDuration = (value: number, format: boolean = false) => {
	if (!format) {
		return new Intl.NumberFormat("nl-NL", {
			notation: "compact",
			maximumFractionDigits: 2,
		}).format(value);
	}

	const minutes = Math.floor(value / 60);
	const seconds = Math.floor(value % 60)
		.toString()
		.padStart(2, "0")
		.replace("-", "");

	return `${minutes}m ${seconds}s`;
};

export const formatWeeklyStatsMessage = (stats: any) => {
	const { pageviews, visitors } = stats;

	return {
		title: "Wekelijkse statistieken",
		message: `Afgelopen week zijn er ${useFormatDuration(pageviews)} weergaven, ${useFormatDuration(visitors)} bezoekers geweest`,
	};
};

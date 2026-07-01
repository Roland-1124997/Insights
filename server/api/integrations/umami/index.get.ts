export default defineSupabaseEventHandler(async (event) => {
	const filter = (getQuery(event).filter || "vandaag") as "vandaag" | "jaar" | "maand" | "week";

	const { startAt, endAt } = formulateDates(filter);

	const { data, error } = await useFetchAnalytics(`stats:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
	});

	if (error || !data) return useReturnResponse(event, internalServerError);

	const { data: devices, error: devicesError } = await useFetchMetrics(`device:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
		type: "device",
	});

	if (devicesError || !devices) return useReturnResponse(event, internalServerError);

	const { data: pages, error: pagesError } = await useFetchMetrics(`path:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
		type: "path",
	});

	if (pagesError || !pages) return useReturnResponse(event, internalServerError);

	const { data: country, error: countryError } = await useFetchMetrics(`country:${filter}`, {
		startAt,
		endAt,
		unit: "day",
		timezone: "Europe/Amsterdam",
		type: "country",
	});

	if (countryError || !country) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			success: true,
			message: "Statistieken succesvol opgehaald",
		},
		data: {
			timeFrame: {
				startAt: new Date(startAt),
				endAt: new Date(endAt),
			},
			statistics: [
				{
					...calculateValues({
						label: "Unieke bezoekers",
						value: data.visitors,
						previous: data.comparison.visitors,
						color: "#6f97ed",
						icon: "akar-icons:person",
						format: false,
					}),
				},
				{
					...calculateValues({
						label: "Bezoeken",
						value: data.visits,
						previous: data.comparison.visits,
						color: "#2563eb",
						icon: "akar-icons:airplay-video",
						format: false,
					}),
				},
				{
					...calculateValues({
						label: "Weergaven",
						value: data.pageviews,
						previous: data.comparison.pageviews,
						color: "#1542a3",
						icon: "akar-icons:eye",
						format: false,
					}),
				},
				{
					...calculateValues({
						label: "Gem. sessieduur",
						value: data.totaltime / data.visits,
						previous: data.comparison.totaltime / data.comparison.visits,
						color: "#0c2970",
						icon: "akar-icons:alarm",
						format: true,
					}),
				},
			],

			metrics: {
				devices: {
					categories: {
						desktop: {
							name: "Desktop",
							color: "#93c5fd",
						},
						mobile: {
							name: "Mobile",
							color: "#60a5fa",
						},
						laptop: {
							name: "Laptop",
							color: "#3b82f6",
						},
						tablet: {
							name: "Tablet",
							color: "#2563eb",
						},
					},
					values: calculateMetrics(devices),
				},
				pages: {
					categories: {
						bezoekers: {
							name: "Bezoekers",
							color: "#6f97ed",
						},
						weergaven: {
							name: "Weergaven",
							color: "#2563eb",
						},
						bezoeken: {
							name: "Bezoeken",
							color: "#1542a3",
						},
					},
					values: calculateMetrics(pages),
				},
				countries: {
					values: calculateMetrics(country),
				},
			},
		},
	});
});

import { randomUUID } from "crypto";
import chalk from "chalk";

const { startAt, endAt } = formulateDates("week");
const timezone = "Europe/Amsterdam";

export default defineTask({
	meta: {
		name: "notifications",
		description: "sends a notification every week with visits page statistics",
	},
	async run() {
		console.log(`\n${chalk.black("[schedule]")} Running at: ${chalk.black(new Date().toLocaleString())}`);

		const { data, error } = await useFetchAnalytics(`stats:week`, {
			startAt,
			endAt,
			unit: "day",
			timezone,
		});

		if (error) return { result: "Error fetching analytics data" };

		const { message, title } = formatWeeklyStatsMessage(data);

		await useSendServiceWorkerPushEvent({
			data: {
				id: randomUUID(),
				title: title,
				message: message,
				url: "/?filter=week",
			},
			events: {
				incoming: true,
				update: false,
				deleted: false,
			},
		});

		return { result: "Success" };
	},
});

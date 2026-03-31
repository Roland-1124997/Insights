import { randomUUID } from "crypto";

const { startAt, endAt } = formulateDates("week");
const timezone = "Europe/Amsterdam";

export default defineTask({
	meta: {
		name: "notifications",
		description: "sends a notification every week with visits page statistics",
	},
	async run() {
		const heartBeat = useHeartBeat("notifications");

		const { data, error } = await useFetchAnalytics(`stats:week`, {
			startAt,
			endAt,
			unit: "day",
			timezone,
		});

		if (error) {
			await heartBeat.error();
			return { result: "Error fetching analytics data" };
		}

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

		await heartBeat.success();
		return { result: "Success" };
	},
});

import { randomUUID } from "crypto";

const { startAt, endAt } = formulateDates("week", true);
const timezone = "Europe/Amsterdam";

export default defineTask({
	meta: {
		name: "notifications",
		description: "sends a notification every week with visits page statistics",
	},
	async run() {
		const heartBeat = useHeartBeat("notifications");

		console.log(new Date(startAt).toLocaleDateString(), new Date(endAt).toLocaleDateString());

		const { data, error } = await useFetchAnalytics(`stats:prev-week`, {
			startAt,
			endAt,
			unit: "day",
			timezone,
		});

		if (error) {
			await heartBeat.error();
			return { result: error };
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

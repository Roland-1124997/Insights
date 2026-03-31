export default defineTask({
	meta: {
		name: "revalidate-imap-cache",
		description:
			"Revalidates the IMAP cache by fetching the latest messages from the mail server and updating the cache accordingly. This task ensures that the cache remains up-to-date with any changes in the mailbox, such as new messages, deletions, or updates to existing messages.",
	},
	async run() {
		const heartBeat = useHeartBeat("imapCache");

		await clearImapMessagesCache();

		return await warmupImapCache()
			.then(async () => {
				await heartBeat.success();
				return { result: "Success" };
			})

			.catch(async (error) => {
				await heartBeat.error();
				return { result: "Error revalidating IMAP cache", error };
			});
	},
});

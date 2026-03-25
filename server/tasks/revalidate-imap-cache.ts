import chalk from "chalk";

export default defineTask({
	meta: {
		name: "revalidate-imap-cache",
		description:
			"Revalidates the IMAP cache by fetching the latest messages from the mail server and updating the cache accordingly. This task ensures that the cache remains up-to-date with any changes in the mailbox, such as new messages, deletions, or updates to existing messages.",
	},
	async run() {
		const startTime = Date.now();
		console.log(`\n${chalk.black("[revalidate]")} Running at: ${chalk.black(new Date().toLocaleString())}`);

		await clearImapMessagesCache();
		await warmupImapCache();

		console.log(`  ${chalk.bold("Time elapsed:")} ${((Date.now() - startTime) / 1000).toFixed(1)}s`);
		return { result: "Success" };
	},
});

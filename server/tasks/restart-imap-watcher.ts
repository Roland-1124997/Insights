export default defineTask({
	meta: {
		name: "restart-imap-watcher",
		description:
			"Restarts the IMAP watcher by stopping any existing watcher instance and starting a new one. This task is useful for ensuring that the IMAP watcher is running with the latest configuration and can help resolve any issues related to the watcher not functioning properly.",
	},
	async run() {
		await stopImapWatcher();
		await startImapWatcher();
		await warmupImapCache();

		return { result: "Success" };
	},
});

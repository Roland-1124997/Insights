import { consola } from "consola";

import { warmupImapCache } from "../utils/imap/watcher";

export default defineNitroPlugin(async () => {
	try {
		await startImapWatcher();
		consola.success("IMAP watcher started successfully.");
	} catch (error) {
		consola.error("Failed to start IMAP watcher:", error);
	}

	// Pre-fill the IMAP cache in the background so the first user request
	// is served from cache instead of hitting the mail server cold.
	warmupImapCache()
		.then(() => {
			consola.success("IMAP cache warmup complete.");
		})
		.catch(() => {
			/* warmup is best-effort */
		});
});

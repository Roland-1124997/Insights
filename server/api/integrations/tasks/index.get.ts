export default defineSupabaseEventHandler(async () => {
	const { result } = await runTask("notifications");

	return { result };
});

export default defineSupabaseEventHandler(async (event) => {
    
    const { result } = await runTask("notifications");

    return { result };
});
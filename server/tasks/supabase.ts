export default defineTask({
	meta: {
		name: "supabase",
		description: "fetch data from supabase to keep the connection alive and prevent cold starts",
	},
	async run() {
		const server = useSupaBaseServer();
		await server.from("artikelen").select("id").limit(1);

		return { result: "Success" };
	},
});

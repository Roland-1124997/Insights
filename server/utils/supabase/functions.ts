import { createClient } from "@supabase/supabase-js";

export { serverSupabaseClient, serverSupabaseUser, serverSupabaseSession, serverSupabaseServiceRole } from "#supabase/server";

let server: SupabaseClient<Database> | null = null;
let client: SupabaseClient<Database> | null = null;

export const useSupaBaseServer = () => {
	if (!server) {
		const config = useRuntimeConfig();
		server = createClient<Database>(config.supabaseUrl || "", config.supabaseSecretKey || "");
	}
	return server;
};

export const useSupaBaseClient = () => {
	if (!client) {
		const config = useRuntimeConfig();
		client = createClient<Database>(config.supabaseUrl || "", config.supabaseKey || "");
	}
	return client;
};

export const subscriptions = defineCachedFunction(
	async (server: SupabaseClient, user_id: string, revalidate: boolean) => {
		if (revalidate) {
			const cache = useStorage("cache");
			await cache.removeItem(`nitro:functions:subscriptions:user-${user_id}.json`);
		}

		const { data } = await server.from("subscriptions").select("id").eq("user_id", user_id);
		const active = (data && data.length > 0) || false;

		return active;
	},
	{
		maxAge: 60 * 60 * 24 * 7, // 7 dagen
		name: "subscriptions",
		getKey: (_server, user_id) => `user-${user_id}`,
	},
);

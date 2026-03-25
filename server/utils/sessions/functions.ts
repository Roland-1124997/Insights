import { H3Event } from "h3";
import { SupabaseClient, Session, User, AuthError } from "@supabase/supabase-js";

export type { SupabaseClient, Session, User };
export type SupaBaseUser = User & { current_session_id: string; aal: string };

export const validateAccessToken = (currentSession: Session | Omit<Session, "user">) => {
	if (!currentSession?.access_token) {
		return {
			valid: false,
			error: {
				message: "de gebruiker heeft geen valide acces token",
				status: 401,
			},
		};
	}
	return { valid: true, error: null };
};

export const validateRefreshToken = (currentSession: Session | Omit<Session, "user">) => {
	if (!currentSession?.access_token) {
		return {
			valid: false,
			error: {
				message: "De gebruiker heeft geen valide refresh token",
				status: 401,
			},
		};
	}
	return { valid: true, error: null };
};

export const useRefreshSession = async (client: SupabaseClient<Database>, currentSession: Session | Omit<Session, "user">) => {
	try {
		const validation = validateRefreshToken(currentSession);
		if (!validation.valid)
			return {
				data: { user: null, session: null },
				error: validation.error,
			};

		return await client.auth.refreshSession(currentSession);
	} catch (error: any) {
		return {
			data: { user: null, session: null },
			error: new AuthError(error.message, error.status),
		};
	}
};

export const useGetSession = async (event: H3Event, client: SupabaseClient<Database>, currentSession: Session | Omit<Session, "user"> | null) => {
	if (!currentSession)
		return {
			data: { user: null },
			error: { message: "De gebruiker heeft geen active sessie", status: 401 },
		};

	const validation = validateAccessToken(currentSession);
	if (!validation.valid)
		return {
			data: { user: null },
			error: validation.error,
		};

	const session_id = extractSessionId(currentSession) as string;

	const cachedResult = await useGetCachedUser(session_id);
	if (cachedResult) return cachedResult;

	const { data: supabaseUser, error } = await useFetchSupabaseUser(event, client, currentSession.access_token!, session_id);

	if (supabaseUser && !error) await useSetCachedUser(session_id, supabaseUser);

	return {
		data: {
			user: {
				...supabaseUser,
			},
		},
		error,
	};
};

export const useDeleteSession = async (client: SupabaseClient<Database>, user: SupaBaseUser) => {
	const { error } = await client.rpc("delete_sessions_by_id", {
		p_session_id: user.current_session_id,
	});
	if (!error) await useDeleteCachedUser(user.current_session_id!);
	return { error };
};

export const useSessionExists = async (event: H3Event, client: SupabaseClient<Database>) => {
	const currentSession = await serverSupabaseSession(event);
	const { data, error } = await useGetSession(event, client, currentSession);

	return { data: data?.user, error };
};

export const extractSessionId = (session: Omit<Session, "user">): string | undefined => {
	if (session?.access_token) {
		try {
			const sessionTokenParts = session.access_token.split(".");
			if (sessionTokenParts.length >= 2 && sessionTokenParts[1]) {
				const token = JSON.parse(Buffer.from(sessionTokenParts[1], "base64").toString("ascii"));
				return token.session_id;
			}
		} catch {
			return;
		}
	}
	return;
};

export const useSetSessionData = async (event: H3Event, user: SupaBaseUser | null) => {
	if (user) {
		const hasMFA = !!(user.factors && user.factors[0] && user.factors[0].status === "verified");
		const needsVerification = hasMFA && user?.aal !== "aal2";

		if (needsVerification) return { mfa_needs_to_verified: true };

		return {
			id: user.id,
			session: user.current_session_id,
			email: user.email,
			factors: {
				verified: hasMFA,
				enabled: !!user.factors,
			},
		};
	}

	return;
};

export const useSetCachedUser = async (session_id: string, user: SupaBaseUser, ttl: number = 60 * 5) => {
	const cachedStorage = useStorage<SupaBaseUser>("sessions");
	await cachedStorage.setItem(session_id, user, { ttl });
};

export const useDeleteCachedUser = async (session_id: string) => {
	const cachedStorage = useStorage<SupaBaseUser>("sessions");
	await cachedStorage.removeItem(session_id);
};

const useGetCachedUser = async (session_id: string) => {
	const cachedStorage = useStorage<SupaBaseUser>("sessions");
	const cachedUser = await cachedStorage.getItem(session_id);

	if (cachedUser)
		return {
			data: {
				user: {
					...cachedUser,
				},
			},
			error: null,
		};

	return null;
};

const useFetchSupabaseUser = async (event: H3Event, client: SupabaseClient<Database>, access_token: string, session_id: string) => {
	const { data, error } = await client.auth.getUser(access_token);
	const user = await serverSupabaseUser(event);

	const supabaseUser = {
		...data.user,
		current_session_id: session_id,
		aal: user?.aal,
	} as SupaBaseUser;

	return { data: supabaseUser, error };
};

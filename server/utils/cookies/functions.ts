import { H3Event } from "h3";
const { production } = useRuntimeConfig();

export const useGetCookies = async (event: H3Event) => {
	const refreshToken = getCookie(event, "refresh-token");
	const session: any = await serverSupabaseSession(event);

	const currentSession: Omit<Session, "user"> | null = {
		refresh_token: refreshToken as string,
		access_token: session?.access_token || ("" as string),
		expires_in: 3600,
		token_type: "bearer",
	};

	return currentSession;
};

export const useSetCookies = (event: H3Event, session: Omit<Session, "user"> | null) => {
	if (session) {
		setCookie(event, "refresh-token", session.refresh_token, {
			maxAge: 60 * 60 * 24 * 14,
			sameSite: "strict",
			httpOnly: true,
			secure: production,
		});
	}
};

export const useDeleteCookies = async (event: H3Event) => {
	deleteCookie(event, "refresh-token");
	deleteCookie(event, "access-token");
};

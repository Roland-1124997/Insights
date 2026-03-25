import { H3Event } from "h3";
import * as csrf from "uncsrf";

const ignoredMethods = ["GET", "HEAD", "OPTIONS"];
const ignorePath = ["/api/savory"];

const defineBaseEventHandler = (
	callback: (
		event: H3Event,
		options: {
			client: SupabaseClient<Database>;
			user: SupaBaseUser | null;
			server: SupabaseClient<Database>;
		},
	) => any,
) => {
	return defineEventHandler(async (event) => {
		const method = event.method.toUpperCase();
		const path = event.path;

		const token = getCookie(event, "csrf-token");
		const stored = useStorage(`csrf-tokens`);
		const isValid = token ? await stored.getItem(token) : false;

		if (ignorePath.includes(path) || ignoredMethods.includes(method) || isValid) {
			await stored.removeItem(token as string);
			deleteCookie(event, "csrf-token");

			const client = await serverSupabaseClient(event);
			const server = serverSupabaseServiceRole(event);

			const { data: user } = await useSessionExists(event, client);

			return callback(event, { client, user: user as SupaBaseUser, server });
		}

		return useReturnResponse(event, {
			status: {
				code: 403,
				success: false,
				message: "Ongeldige CSRF token",
			},
		});
	});
};

export const defineSupabaseEventHandler = (
	callback: (
		event: H3Event,
		options: {
			client: SupabaseClient<Database>;
			user: SupaBaseUser;
			server: SupabaseClient<Database>;
			IsFactorVerified: boolean;
		},
	) => any,
) => {
	return defineBaseEventHandler(async (event, { client, user, server }) => {
		if (!user) return useReturnResponse(event, unauthorizedError);

		const IsFactorVerified = (user.factors && user.factors[0] && user.factors[0].status === "verified") || false;

		if (IsFactorVerified && user.aal != "aal2")
			return useReturnResponse(event, {
				status: {
					success: false,
					redirect: "/auth/verify",
					message: "MFA verification required",
					code: 401,
				},
			});

		return callback(event, {
			client,
			user: user as SupaBaseUser,
			server,
			IsFactorVerified,
		});
	});
};

export const defineMultiFactorVerificationEventHandler = (
	callback: (
		event: H3Event,
		options: {
			client: SupabaseClient<Database>;
			user: SupaBaseUser;
			server: SupabaseClient<Database>;
		},
	) => any,
) => {
	return defineSupabaseEventHandler(async (event, { user, client, server, IsFactorVerified }) => {
		if (IsFactorVerified && user.aal == "aal2") {
			const { data: factors, error: factorError } = await client.auth.mfa.listFactors();
			if (factorError || !factors.all || !factors.all[0]) return useReturnResponse(event, internalServerError);

			const request = await readBody<{ code: string }>(event);

			const { error } = await client.auth.mfa.challengeAndVerify({
				factorId: factors.all[0].id,
				code: request.code,
			});

			if (error)
				return useReturnResponse(event, {
					...unauthorizedError,
					error: {
						type: "fields",
						details: {
							code: "De opgegeven code is ongeldig.",
						},
					},
				});
		}

		return callback(event, { client, user: user as SupaBaseUser, server });
	});
};

export const defineSecurityEventHandler = (callback: (event: H3Event) => any) => {
	return defineEventHandler(async (event) => {
		const config = useRuntimeConfig();
		const security = config.security as ModuleOptions;

		const secret = getCookie(event, security.key!) ?? "";
		const token = getHeader(event, security.header!) ?? "";

		const isValidToken = await csrf.verify(secret, token, await useSecretKey(security), security.encryptAlgorithm);

		if (!isValidToken) return useReturnResponse(event, unauthorizedError);

		return callback(event);
	});
};

export const defineAuthEventHandler = (
	callback: (
		event: H3Event,
		options: {
			client: SupabaseClient<Database>;
			user: SupaBaseUser;
			server: SupabaseClient<Database>;
		},
	) => any,
) => {
	return defineBaseEventHandler(async (event, { client, user, server }) => {
		return callback(event, { client, user: user as SupaBaseUser, server });
	});
};

export const defineSupabaseFileHandler = (callback: (event: H3Event, options: { user: SupaBaseUser | null; server: SupabaseClient<Database> }) => any) => {
	return defineBaseEventHandler(async (event, { user, server }) => {
		return callback(event, { user: user as SupaBaseUser, server });
	});
};

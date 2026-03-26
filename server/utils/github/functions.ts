import { Octokit } from "@octokit/core";
import { createAppAuth } from "@octokit/auth-app";
import type { Endpoints } from "@octokit/types";
import crypto from "crypto";

const config = useRuntimeConfig();

export const useOctokit = async (InstallID: string) => {
	const appId = config.appId;
	const privateKey = config.privateKey;
	const clientId = config.clientId;
	const clientSecret = config.clientSecret;

	const auth = createAppAuth({
		appId: appId,
		privateKey: privateKey,
		clientId: clientId,
		clientSecret: clientSecret,
	});

	const installationId = [InstallID];
	const installationApp: any = await auth({
		type: "installation",
		installationId,
	} as any);

	const token = installationApp.token;
	const instalId = installationApp.installationId;
	const createdAt = installationApp.createdAt;
	const expiresAt = installationApp.expiresAt;

	return {
		token: token,
		instalId: instalId,
		createdAt: createdAt,
		expiresAt: expiresAt,
	};
};

type Repositories = Endpoints["GET /installation/repositories"]["response"]["data"];

const useFetchRepositories = async (token: string, per_page: number = 100): Promise<{ data: Repositories | null; error: unknown }> => {
	let result: Repositories | null = null;
	let error: unknown = null;

	const octokit = new Octokit({ auth: token });

	await octokit
		.request("GET /installation/repositories", {
			per_page: per_page,
		})
		.then(({ data }) => {
			const sorted = data.repositories.sort((a, b) => {
				const dateA = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
				const dateB = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;
				return dateB - dateA;
			});

			data.repositories = sorted;

			result = data;
		})
		.catch((err) => {
			error = err;
		});

	return { data: result, error };
};

export const useGetRepositories = async (token: string, per_page: number) => {
	const cacheKey = `cache:nitro:functions:repos-${token}`;
	const stored = useStorage(cacheKey);

	const cached = await stored.getItem<Repositories>(cacheKey);
	if (cached) return { data: cached, error: null };

	const { data, error } = await useFetchRepositories(token, per_page);
	if (data) await stored.setItem(cacheKey, data, { ttl: 60 * 5 });

	return { data, error };
};

export const useEncryptValue = (value: string, stringify: boolean = false) => {
	value = stringify ? JSON.stringify(value) : value;

	const key = config.SaltToken;
	const cipher = crypto.createCipheriv("aes-256-cbc", key, Buffer.alloc(16));
	let encrypted = cipher.update(value, "utf8", "hex");
	encrypted += cipher.final("hex");
	return encrypted;
};

export const useDecryptValue = (encryptedValue: string, parse: boolean = false) => {
	const key = config.SaltToken;
	const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.alloc(16));
	let decrypted = decipher.update(encryptedValue, "hex", "utf8");
	decrypted += decipher.final("utf8");
	return parse ? JSON.parse(decrypted) : decrypted;
};

export const useSaveInstall = async (server: SupabaseClient<Database>, action: "Create" | "Update", user: User, OctoKitData: any) => {
	const { token, instalId, createdAt, expiresAt } = OctoKitData;

	if (action === "Create") {
		await server.from("github_connections").insert([
			{
				token: useEncryptValue(token),
				user_id: user.id,
				installation_id: instalId,
				created_at: createdAt,
				expires_at: expiresAt,
			},
		]);
	} else if (action === "Update") {
		await server
			.from("github_connections")
			.update({
				token: useEncryptValue(token),
				created_at: createdAt,
				expires_at: expiresAt,
			})
			.eq("user_id", user.id);
	}
};

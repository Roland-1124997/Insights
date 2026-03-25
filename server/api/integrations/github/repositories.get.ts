export default defineSupabaseEventHandler(async (event, { user, server }) => {
	const { data: connection, error } = await usefetchGithubConnections(server, user);
	const per_page = 50;

	if (error || !connection) return useReturnResponse(event, notFoundError);

	const currentPage = Number(getQuery(event).page ?? 1);

	const { data: repo, error: repo_error } = await useGetRepositories(connection.token, per_page, currentPage);

	if (repo)
		return useReturnResponse(event, {
			status: {
				success: true,
				code: 200,
				message: "projecten succesvol opgehaald",
			},
			pagination: {
				page: currentPage,
				total: Math.ceil(repo.total_count / per_page),
			},
			data: repo.repositories,
		});

	if (repo_error) {
		const { data: refresh_connection } = await useRefreshGithubConnections(server, user, connection.installation_id);

		if (refresh_connection) {
			const { data: repo, error: repo_error } = await useGetRepositories(refresh_connection.token, per_page, currentPage);
			if (repo_error) return useReturnResponse(event, notFoundError);

			if (repo)
				return useReturnResponse(event, {
					status: {
						success: true,
						code: 200,
						message: "projecten succesvol opgehaald",
					},
					pagination: {
						page: currentPage,
						total: Math.ceil(repo.total_count / per_page),
					},
					data: repo.repositories,
				});
		}
	}
});

const useRefreshGithubConnections = async (server: SupabaseClient<Database>, user: User, install_id: string) => {
	const octokitData = await useOctokit(install_id);
	await useSaveInstall(server, "Update", user, octokitData);

	return await usefetchGithubConnections(server, user);
};

const usefetchGithubConnections = async (server: SupabaseClient<Database>, user: User) => {
	const { data, error } = await server.from("github_connections").select("*").eq("user_id", user.id).single();

	if (data && data.token) data.token = useDecryptValue(data.token);

	return { data, error };
};

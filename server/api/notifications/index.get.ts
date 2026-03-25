export default defineSupabaseEventHandler(async (event) => {
	const page = Number(getQuery(event).page || 1);
	const search = (getQuery(event).search || "") as string;
	const filter = (getQuery(event).filter || "") as string;

	String((getQuery(event).search as string) ?? "").toLowerCase();

	let response = await fetchImapMessagesFromStorageCache({
		limit: 4,
		page,
		filter,
		search,
	});

	if (!response) {
		const { imap_client, imap_error } = await useConnectClient();
		if (imap_error || !imap_client) return useReturnResponse(event, internalServerError);

		await useGetImapMailbox(imap_client, "INBOX");

		response = await fetchImapMessages(imap_client, {
			limit: 4,
			page,
			filter,
			search,
		});

		await useCloseImapClient(imap_client);
	}

	const { data, unseen, error, pagination } = response;

	return useReturnResponse(event, {
		status: {
			code: 200,
			success: error || !data ? false : true,
			message: error || !data ? "Er zijn geen berichten gevonden" : "Berichten succesvol opgehaald",
		},
		pagination: {
			page: pagination?.current_page || page,
			total: pagination?.total_Pages || 1,
		},
		data: {
			messages: data?.messages || [],
			unseen: unseen,
		},
	});
});

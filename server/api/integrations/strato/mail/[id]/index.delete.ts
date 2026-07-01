export default defineSupabaseEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) return useReturnResponse(event, badRequestError);

	const { imap_client, imap_error } = await useConnectClient();
	if (imap_error || !imap_client) return useReturnResponse(event, internalServerError);

	await useGetImapMailbox(imap_client, "INBOX");

	const search = { uid: id };

	const { error: messageError } = await useDeleteMessage(imap_client, search);
	if (messageError) {
		await useCloseImapClient(imap_client);
		return useReturnResponse(event, internalServerError);
	}

	await removeImapMessageFromCache(id);
	await useCloseImapClient(imap_client);

	return useReturnResponse(event, {
		status: {
			success: true,
			code: 200,
			message: "Bericht succesvol verwijderd",
		},
	});
});

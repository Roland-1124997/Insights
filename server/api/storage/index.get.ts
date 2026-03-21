export default defineSupabaseEventHandler(async (event, { server }) => {

    const page = Number(getQuery(event).page || 1);
    const search = String(getQuery(event).search || '');
    const filter = String(getQuery(event).filter || '');

    const { files, total } = await fetchStorageFiles(server, {
        limit: 50, page, search, filter,
    });

    return useReturnResponse(event, {
        status: {
            code: 200,
            message: 'Bestanden succesvol opgehaald',
            success: true
        },
        pagination: {
            page: page,
            total,
        },
        data: Object.groupBy(files, (file) => file.article_name)
    })

});


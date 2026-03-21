export default defineSupabaseEventHandler(async (event, { server }) => {

    const articleId = getQuery(event).articleId as string | undefined;
    const published = getQuery(event).published === 'true' || false;
    const files = await readMultipartFormData(event);
    const errors = [];

    if (!files || files.length === 0) return useReturnResponse(event, badRequestError);

    for (const file of files) {

        const { data, error } = await server.storage.from('stores').upload(
            `/${file.filename?.replaceAll(" ", "-")}`, file.data, {
            cacheControl: '3600',
            upsert: true,
            contentType: file.type
        })

        const { error: upsertError } = await server.from('attachments').upsert({
            id: data?.id,
            name: data?.path || '',
            published: published,
            article_id: articleId,
            updated_at: new Date().toISOString(),
            label: getTypeLabel(types, file.filename?.split('.').pop() || '')
        }, {
            onConflict: 'id'
        });

        if (error || upsertError) errors.push({ file: file.filename, message: error?.message || upsertError?.message || 'Unknown error' });
    }

    if (errors.length > 0) {
        return useReturnResponse(event, {
            status: {
                code: 500,
                message: 'someige bestanden konden niet worden geüpload',
                success: false
            },
            data: {
                errors: errors
            }
        });
    }

    await invalidateStorageFilesCache();

    return useReturnResponse(event, {
        status: {
            code: 200,
            message: 'Bestanden succesvol geüpload',
            success: true
        },
    });

});



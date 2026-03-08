export default defineSupabaseEventHandler(async (event, { user, server }) => {

    const id = getRouterParam(event, "id");
    if (!id) return useReturnResponse(event, badRequestError);

    const request = await readBody(event)
    const { error: zodError } = await schema.subscription.backend.safeParseAsync(request);

    if (zodError) return useReturnResponse(event, {
        ...badRequestError,
        error: {
            type: "fields",
            details: zodError.issues
        }
    });

    const { error } = await server.from('subscriptions').update({
        endpoint: useEncryptValue(request.endpoint), 
        keys: useEncryptValue(request.keys, true),
    }).eq("id", id).eq("user_id", user.id)

    if (error) return useReturnResponse(event, internalServerError)

    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "OK",
        }
    })

});
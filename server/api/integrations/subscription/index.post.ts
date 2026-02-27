export default defineSupabaseEventHandler(async (event, { user, server }) => {

    const request = await readBody(event)

    const { data, error } = await server.from('subscriptions').upsert({
        user_id: user.id,
        subscription: request.subscription,
    })

    if (error) return useReturnResponse(event, internalServerError)

    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "OK",
        }
    })

});
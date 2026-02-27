export default defineSupabaseEventHandler(async (event, { user, server }) => {

    const { error } = await server.from('subscriptions').delete().eq("user_id", user.id)
    if (error) return useReturnResponse(event, internalServerError)

    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "OK",
        }
    })

});
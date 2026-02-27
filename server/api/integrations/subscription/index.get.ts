export default defineSupabaseEventHandler(async (event, { user, server }) => {

    const { data } = await server.from('subscriptions').select().eq("user_id", user.id).single()
    
    return useReturnResponse(event, {
        status: {
            success: true,
            code: 200,
            message: "OK",
        },
        data: {
            subscription: !!data?.subscription
        }

    })

});
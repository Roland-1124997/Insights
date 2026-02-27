
export default defineSupabaseEventHandler(async (event, { user }) => {

    const emitter = getImapEmitter();

    const eventStream = createEventStream(event);

    const push = async (payload: any) => {

        if(payload.events.incoming) await useSendNotification(payload, user.id)
        eventStream.push(JSON.stringify(payload));

    };

    emitter.on('new', push);

    eventStream.onClosed(async () => {
        emitter.off('new', push);
    });

    return eventStream.send();

});

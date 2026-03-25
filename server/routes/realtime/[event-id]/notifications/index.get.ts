export default defineSupabaseEventHandler(async (event) => {
	const emitter = getImapEmitter();

	const eventStream = createEventStream(event);

	const push = async (payload: any) => {
		await eventStream.push(JSON.stringify(payload));
	};

	emitter.on("new", push);

	eventStream.onClosed(async () => {
		emitter.off("new", push);
	});

	return eventStream.send();
});

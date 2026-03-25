type NavigatorRequest = {
	ip: string;
	country_code?: string;
	region_code?: string;
	city?: string;
	continent_code?: string;
	timezone?: string;
};

const kownIps = new Map<string, NavigatorRequest>();

export default defineAuthEventHandler(async (event, { user, server }) => {
	if (!user) return useReturnResponse(event, unauthorizedError);

	const request = await readBody(event);
	const { error: zodError } = await schema.navigator.backend.safeParseAsync(request);

	if (zodError)
		return useReturnResponse(event, {
			...badRequestError,
			error: {
				type: "fields",
				details: zodError.issues,
			},
		});

	if (!kownIps.has(request.ip)) {
		await fetch(`https://geoip.vuiz.net/geoip?ip=${request.ip}`)
			.then((res) => res.json())
			.then((data: NavigatorRequest) => kownIps.set(request.ip, data));
	}

	const data: NavigatorRequest = kownIps.get(request.ip)!;

	await server.from("navigator_sessions").insert({
		id: user.current_session_id,
		ip: request.ip,
		screen: request.screen,
		country_code: data.country_code,
		region_code: data.region_code,
		continent_code: data.continent_code,
		city: data.city,
		timezone: data.timezone,
	});
});

export default defineEventHandler((event) => {
	return useReturnResponse(event, {
		status: {
			success: true,
			code: 200,
			message: "OK",
		},
	});
});

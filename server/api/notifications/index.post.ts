import { generateHTML } from "@tiptap/html";
import jsdom from "jsdom";

export default defineSupabaseEventHandler(async (event) => {
	const request = await readBody(event);
	const { error: zodError } = await schema.notification.backend.safeParseAsync(request);

	let html = generateHTML(request.content, extensions);

	if (zodError)
		return useReturnResponse(event, {
			...badRequestError,
			error: {
				type: "fields",
				details: zodError.issues,
			},
		});

	const document = new jsdom.JSDOM(request.referentie);

	const tags = document.window.document.querySelectorAll("p");
	tags.forEach((element) => {
		if (element.classList.contains("p2")) element.remove();
	});

	const referentie = document.window.document.body.innerHTML;

	const { error } = await useMailer({
		recepient: request.email,
		subject: request.onderwerp,
		body: html + referentie,
	});

	if (error) return useReturnResponse(event, internalServerError);

	return useReturnResponse(event, {
		status: {
			code: 200,
			success: true,
			message: "Bericht succesvol verzonden",
			redirect: "/berichten",
		},
	});
});

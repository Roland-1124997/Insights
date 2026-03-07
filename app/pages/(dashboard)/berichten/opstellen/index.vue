<template>
	<div class="relative bg-white">
		<ClientOnly>
			<FormBase :appendToBody :schema="schema.notification.frontend" :request v-slot="{ loading, errors }">
				<div class="grid grid-cols-3 gap-2">
					<div class="sr-only" aria-hidden>
						<UtilsInput name="referentie" label="Referentie" icon-name="akar-icons:link-chain" type="text" placeholder="Referentie" :disabled="loading" :hide-label="true" :initial-value="repliedContent" />
					</div>

					<div class="col-span-3">
						<UtilsInput name="email" label="E-mailadres ontvanger" icon-name="akar-icons:envelope" type="email" placeholder="gebruiker@example.nl" :initial-value="email" :required="true" :disabled="loading" :hide-label="true" />
					</div>
					<div class="col-span-2">
						<UtilsInput name="onderwerp" label="Onderwerp van het bericht" icon-name="akar-icons:tag" type="text" placeholder="Onderwerp" :initial-value="onderwerp" :disabled="loading" :required="true" :hide-label="true" />
					</div>

					<button type="submit" class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg select-none hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Verstuur bericht" :disabled="loading">
						<span v-if="!loading">Verstuur</span>
						<span v-else>verzenden...</span>
					</button>
				</div>
			</FormBase>
		</ClientOnly>

		<section v-if="editor" class="z-10 bg-white">
			<TiptapMenu class="flex items-center p-1 py-1 mt-2 mb-2 overflow-x-auto underline border rounded-lg" :editor="editor" :hidden :editable="true" />
			<div :class="content != '' ? 'gap-4 p-2' : 'p-3'" class="grid grid-cols-1 mt-3 overflow-auto outline-none appearance-none max-h-[62vh] md:max-h-[67vh] rounded-lg bg-gray-50">
				<TiptapEditor :class="content != '' ? 'px-2 border-l-2 border-yellow-500 max-w-none bg-yellow-50' : ''" :editor="editor" v-model="content" aria-label="Bericht inhoud" />
				<iframe v-if="content" ref="previewFrame" :srcdoc="content" sandbox="" title="inhoud mail" class="w-full overflow-scroll h-[65vh] px-2 border-l-2 border-blue-500 text-balance viewer"></iframe>
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
	
	
	useSeoMeta({
		title: "Bericht Opstellen",
		description: "Stel een nieuw bericht of e-mail op en verstuur deze.",
		ogTitle: "Bericht Opstellen",
		ogDescription: "Stel een nieuw bericht of e-mail op en verstuur deze.",
		ogUrl: "/berichten/opstellen",
		ogImage: "/icons/icon_512.png",
		twitterTitle: "Bericht Opstellen",
		twitterDescription: "Stel een nieuw bericht of e-mail op en verstuur deze.",
		twitterImage: "/icons/icon_512.png",
		twitterCard: "app",
	});

	useHead({
		htmlAttrs: {
			lang: "nl",
		},
		link: [
			{
				rel: "icon",
				type: "image/png",
				href: "/icons/icon_512.png",
			},
		],
	});

	const { addToast } = useToast();

	const hidden = ["Highlight", "link", "Paragraph", "Code Block", "Horizontal Rule", "Heading 1", "Heading 2", "Heading 3", "Heading 4", "Details", "Verbind project", "Image Meta"];

	const store = useNotifications();

	const route = useRoute();
	const data = store.getSavedPayload() || {};

	const email = ref(data?.from?.address || "");
	const onderwerp = ref(data?.subject ? (data.subject.startsWith("Re:") ? data.subject : `Re: ${data.subject}`) : "");

	const repliedContent = data?.html
		? `<hr style="margin-top: 1em; margin-bottom: 1em;"><p>
		<strong>Van:</strong> ${data.from.name} &lt;${data.from.address}&gt;<br/>
		<strong>Datum:</strong> ${useFormatDate(data.date)}<br/>
		</p> ${data.origin == "email" ? "" : " <br/>"}  ${data.html}`
		: "";

	const content = ref(repliedContent || "");
	const composedContent = useLocalStorage<string>("notification:composed:payload", null);

	const introduce = `<p><strong>Beste, ${data?.from?.name || "[naam]"}</strong></p><p>hartelijk bedank voor het bericht</p>`;
	const focus = `<p></p><p></p><p></p>`;
	const slot = `<p>Met vriendelijke groet,</p><p><strong>Roland Meijer</strong></p>`;

	const placeholder = route.query.reply ? `${introduce}${focus}${slot}` : "";

	const editor = useEditor({
		content: composedContent.value ? composedContent.value : placeholder,
		extensions: extensions,
		onCreate: ({ editor }) => {
			const element = editor.view.dom.querySelectorAll("p");
			const focusedElement = element[3];

			if (focusedElement) {
				const range = document.createRange();
				const selection = window.getSelection();

				range.setStart(focusedElement, 0);
				range.collapse(true);

				selection?.removeAllRanges();
				selection?.addRange(range);
			}
		},
		onUpdate: ({ editor }) => {
			composedContent.value = editor.getHTML();
		},
	});

	onUnmounted(() => {
		if (editor.value) {
			editor.value.destroy();
		}
	});

	onBeforeRouteLeave(() => {
		composedContent.value = null;
		store.clearSavedPayload();
	});

	const successMessage = route.query.reply ? "Je antwoord is succesvol verzonden!" : "Je bericht is succesvol verzonden!";
	const failureMessage = route.query.reply ? "Er is een fout opgetreden bij het verzenden van je antwoord. Probeer het later opnieuw." : "Er is een fout opgetreden bij het verzenden van je bericht. Probeer het later opnieuw.";

	const request: requestOptions = {
		url: "/api/notifications" as FetchUrl,
		method: "POST" as SendOptions["method"],
		successMessage,

		onsuccess: () => {
			composedContent.value = null;
			store.clearSavedPayload();
		},

		onfailure: () => {
			addToast({
				type: "error",
				message: failureMessage,
				duration: 5000,
			});
		},
	};

	const appendToBody = async (values: any) => {
		return {
			...values,
			content: editor.value ? editor.value.getJSON() : "",
		};
	};
</script>

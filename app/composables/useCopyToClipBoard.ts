const { addToast } = useToast();

export const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text);
		addToast({
			type: "success",
			message: "Tekst succesvol gekopieerd naar het klembord.",
			duration: 3000,
		});
	} catch (err) {
		console.error("Failed to copy: ", err);
		addToast({
			type: "error",
			message: "Er is een fout opgetreden bij het kopiëren naar het klembord.",
			duration: 3000,
		});
	}
};

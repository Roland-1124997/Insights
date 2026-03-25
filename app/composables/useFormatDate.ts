export const useFormatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("nl-NL", {
		day: "2-digit",
		month: "2-digit",
		year: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

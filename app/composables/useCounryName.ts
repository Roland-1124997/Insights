export const useCounryName = (countryCode: string | null, lang: string = "nl") => {
	if (!countryCode) return "Onbekend";
	const regionNames = new Intl.DisplayNames([lang], { type: "region" });
	return regionNames.of(countryCode) || "Onbekend";
};

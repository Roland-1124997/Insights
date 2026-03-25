export const useStatusCodes: Record<number, { message: string; statusMessage: string }> = {
	300: {
		message: "Meerdere opties",
		statusMessage: "Het verzoek heeft meerdere mogelijke antwoorden. Selecteer een van de opties.",
	},
	301: {
		message: "Permanent verplaatst",
		statusMessage: "Deze bron is permanent naar een nieuwe URL verplaatst. Werk je bladwijzers bij.",
	},
	302: {
		message: "Gevonden",
		statusMessage: "De gevraagde bron bevindt zich tijdelijk op een ander URL. Probeer het later opnieuw.",
	},
	303: {
		message: "Zie ander",
		statusMessage: "Deze bron is op een ander URL te vinden. Volg de verstrekte link.",
	},
	304: {
		message: "Niet gewijzigd",
		statusMessage: "De bron is sinds het laatste verzoek niet gewijzigd. Gebruik de cached versie indien beschikbaar.",
	},
	307: {
		message: "Tijdelijke omleiding",
		statusMessage: "Deze bron is tijdelijk verplaatst. Gebruik de oorspronkelijke verzoeksmethode.",
	},
	308: {
		message: "Permanente omleiding",
		statusMessage: "Deze bron is permanent verplaatst. Gebruik de oorspronkelijke verzoeksmethode bij toegang.",
	},

	400: {
		message: "Ongeldig verzoek",
		statusMessage: "Het verzoek was ongeldig of slecht geformatteerd. Controleer je invoer en probeer opnieuw.",
	},
	401: {
		message: "Niet geverifieerd",
		statusMessage: "Toegang geweigerd. Geef geldige verificatiegegevens op.",
	},
	402: {
		message: "Betaling vereist",
		statusMessage: "Deze bron vereist betaling voordat toegang wordt verleend.",
	},
	403: {
		message: "Verboden",
		statusMessage: "Je hebt geen toestemming voor toegang tot deze bron.",
	},
	404: {
		message: "Pagina niet gevonden",
		statusMessage: "De gezochte pagina bestaat niet of is verplaatst. Controleer de URL of ga terug naar het startscherm.",
	},
	405: {
		message: "Methode niet toegestaan",
		statusMessage: "De aangevraagde HTTP-methode is niet toegestaan voor deze bron.",
	},
	406: {
		message: "Niet aanvaardbaar",
		statusMessage: "De aangevraagde bron kan niet in het aangevraagde formaat worden verstrekt.",
	},
	407: {
		message: "Proxyverificatie vereist",
		statusMessage: "Verificatie is vereist voor deze proxyserver.",
	},
	408: {
		message: "Verzoek timeout",
		statusMessage: "De server reageerde te langzaam. Probeer later opnieuw.",
	},
	409: {
		message: "Conflict",
		statusMessage: "Er is een conflict met de huidige staat van de bron. Los het conflict op en probeer opnieuw.",
	},
	410: {
		message: "Weg",
		statusMessage: "Deze bron is niet meer beschikbaar en is permanent verwijderd.",
	},
	411: {
		message: "Lengte vereist",
		statusMessage: "Het verzoek moet een geldige Content-Length header bevatten.",
	},
	412: {
		message: "Voorwaarde mislukt",
		statusMessage: "Een voorwaarde voor dit verzoek was niet vervuld.",
	},
	413: {
		message: "Payload te groot",
		statusMessage: "De verzoeksbody is te groot. Verminder de grootte en probeer opnieuw.",
	},
	414: {
		message: "URL te lang",
		statusMessage: "De aangevraagde URL is te lang. Vereenvoudig je verzoek.",
	},
	415: {
		message: "Niet-Ondersteund mediatype",
		statusMessage: "De server ondersteunt het aangevraagde mediaformaat niet.",
	},
	429: {
		message: "Te veel verzoeken",
		statusMessage: "Je hebt in korte tijd te veel verzoeken gedaan. Vertraging en probeer later opnieuw.",
	},

	500: {
		message: "Interne serverfout",
		statusMessage: "Er is iets fout gegaan aan onze kant. Probeer later opnieuw.",
	},
	501: {
		message: "Niet geïmplementeerd",
		statusMessage: "De server ondersteunt de aangevraagde functie of methode niet.",
	},
	502: {
		message: "Slechte gateway",
		statusMessage: "De server ontving een ongeldig antwoord van een upstream server.",
	},
	503: {
		message: "Service niet beschikbaar",
		statusMessage: "De server is momenteel niet beschikbaar vanwege onderhoud of hoge belasting. Probeer later opnieuw.",
	},
	504: {
		message: "Gateway timeout",
		statusMessage: "De server ontving geen tijdig antwoord van een upstream server.",
	},
	505: {
		message: "HTTP-versie niet ondersteund",
		statusMessage: "De aangevraagde HTTP-versie wordt niet ondersteund door deze server.",
	},
};



const createButton = (overrides: Buttons) => ({
    ...overrides,
    iconName: overrides.iconName || "akar-icons:edit",
});

const createFilter = (type: string, iconName: string, label: string, ariaLabel: string, color: string, shortLabel: string, large: boolean, alwaysShowLabel = true) => ({
    type, iconName, label, alwaysShowLabel, ariaLabel, color, large, shortLabel: shortLabel,
});

const createSearch = (context: string) => ({
    label: `Zoek in ${context}`,
    placeholder: `Zoek in ${context}...`,
});



const routes = (subscriptionActive: boolean): Record<string, RouteType> => {

    return {
        "/": {
            label: "Statistieken",
            iconName: "akar-icons:statistic-up",
            toolbar: {
                groupWithFilters: true,
                fallbackFilter: 'vandaag',
                filters: [
                    createFilter("vandaag", "akar-icons:clock", "Vandaag", "Toon statistieken van vandaag", "neutral", "Vandaag", false, false),
                    createFilter("week", "akar-icons:calendar", "Deze week", "Toon statistieken van deze week", "blue", "Week", true, true),
                    createFilter("maand", "akar-icons:calendar", "Deze maand", "Toon statistieken van deze maand", "blue", "Maand", true, true),
                    createFilter("jaar", "akar-icons:calendar", "Dit jaar", "Toon statistieken van dit jaar", "blue", "Jaar",true, true),
                ],
                store: 'useAnalytics',
            },
            
        },
        "/berichten": {
            label: "Berichten",
            iconName: "akar-icons:inbox",
            alert: true,
            toolbar: {
                fallbackFilter: 'alles',
                buttons: [
                    createButton({
                        to: "/berichten/opstellen",
                        description: "Nieuw bericht schrijven",
                    }),
                    createButton({
                        iconName: "akar-icons:arrow-cycle",
                        description: "Bestanden synchroniseren",
                        isButton: true,
                        onClick: "refresh",
                    }),
                    createButton({
                        iconName: subscriptionActive ? "ri:notification-off-line" : "ri:notification-3-line",
                        description: "Notificaties beheren",
                        isButton: true,
                        onClick: subscriptionActive ? "unsubscribe" : "subscribe",
                    }),
                ],
                filters: [
                    createFilter("alles", "akar-icons:filter", "Alles", "Toon alle berichten", "neutral", "Alles", false, false),
                    createFilter("gelezen", "akar-icons:open-envelope", "Gelezen", "Zoek gelezen berichten", "blue", "Gelezen", true),
                    createFilter("ongelezen", "akar-icons:envelope", "Ongelezen", "Zoek ongelezen berichten", "red","Ongelezen", true),
                ],
                search: createSearch("berichten"),
                store: 'useNotifications',
            },
            
        },
        "/artikelen": {
            label: "Artikelen",
            iconName: "akar-icons:newspaper",
            toolbar: {
                buttons: [
                    createButton({
                        to: "/artikelen/opstellen",
                        description: "Nieuw artikel schrijven",
                    }),
                    createButton({
                        iconName: "akar-icons:arrow-cycle",
                        description: "Bestanden synchroniseren",
                        isButton: true,
                        onClick: "refresh",
                    }),
                ],
                search: createSearch("artikelen"),
                store: 'useArticles',
            },
        },
        "/opslagruimte": {
            label: "Opslagruimte",
            iconName: "akar-icons:folder",
            toolbar: {
                fallbackFilter: 'alles',
                buttons: [
                    createButton({
                        iconName: "akar-icons:cloud-upload",
                        description: "Bestanden uploaden",
                        isButton: true,
                        onClick: "triggerFileSelect",
                    }),
                    createButton({
                        iconName: "akar-icons:arrow-cycle",
                        description: "Bestanden synchroniseren",
                        isButton: true,
                        onClick: "refresh",
                    }),
                ],
                filters: [
                    createFilter("alles", "akar-icons:filter", "Alles", "Toon alle bestanden", "neutral", "Alles", false, false),
                    createFilter("afbeelding", "akar-icons:image", "Afbeeldingen", "Toon alleen afbeeldingen", "blue", "Afbeeldingen", true, false),
                    createFilter("document", "akar-icons:file", "Documenten", "Toon alleen documenten", "blue", "Documenten", true, false),
                    createFilter("zip", "akar-icons:data", "Archieven", "Toon alleen archieven", "blue", "Archieven", true, false),
                    createFilter("PowerPoint", "akar-icons:product-hunt-fill", "PowerPoint", "Toon alleen PowerPoint bestanden", "blue", "PowerPoint", true),
                ],
                search: createSearch("bestanden"),
                store: 'useStorage',
            },
        },
        "/account": {
            label: "Account",
            iconName: "akar-icons:person",
            refetchOnEnter: true,
            toolbar: {
                store: 'useAccount',
            },
        },
        "/portfolio": {
            label: "Portfolio",
            iconName: "akar-icons:telescope",
        }
    }
}

export default defineSupabaseEventHandler( async (event, { user, server }) => {
    
    const { data, error } = await server.from('subscriptions').select().eq("user_id", user.id).single()
    
    const subscriptionActive = !!data?.subscription
    return routes(subscriptionActive)

});


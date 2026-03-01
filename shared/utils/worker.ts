export const getProviderName = (subscription: any) => {

    if (!subscription) return null

    const endpoint = subscription.endpoint

    if (endpoint.includes("google")) return "google"
    if (endpoint.includes("apple")) return "apple"
    if (endpoint.includes("mozilla")) return "mozilla"

    return "unknown"
}
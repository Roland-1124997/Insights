export const usePush = async () => {

    const url = "/api/integrations/subscription"
    const { Post, Delete } = useApiHandler(url)

    const { addToast } = useToast()
    const active = ref(false)

    const { data, error } = await useFetch<ApiResponse<{ subscription: boolean }>>(url)
    if (!error.value && data.value?.data) active.value = data.value.data.subscription

    const subscribe = () => {
        Notification.requestPermission()
            .then((permission) => {
                if (permission !== 'granted') {
                    addToast({
                        message: `Notification permisions denied`,
                        type: "error",
                        duration: 5000,
                    })
                    return
                }

                if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                    addToast({
                        message: "Push not supported in this browser.",
                        type: "error",
                        duration: 5000,
                    })
                    return
                }

                return navigator.serviceWorker.ready
            })
            .then((registration) => {
                if (!registration) return

                const { vapidPublicKey } = useRuntimeConfig().public
                const vapidKey = vapidPublicKey?.trim().replace(/['",]/g, '')

                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(vapidKey)
                })
            })
            .then((subscription) => {
                if (!subscription) return
                return Post({ body: { subscription } })
            })
            .then((res) => {
                if (res !== undefined) {
                    addToast({
                        message: "Push subscription enabled successfully.",
                        type: "success",
                        duration: 5000,
                    })
                    active.value = true
                }
            })
            .catch((error) => {
                addToast({
                    message: `An error occurred: ${error}`,
                    type: "error",
                    duration: 5000,
                })
            })
    }

    const unsubscribe = () => {
        navigator.serviceWorker.ready
            .then((registration) => {
                return registration.pushManager.getSubscription()
            })
            .then((subscription) => {
                if (!subscription) {
                    addToast({
                        message: "No active push subscription found.",
                        type: "info",
                        duration: 3000,
                    })
                    return null
                }

                return subscription.unsubscribe().then((success) => {
                    if (success) return Delete()
                    else throw new Error("Failed to unsubscribe from push")
                })
            })
            .then((res) => {
                if (res !== null && res !== undefined) {
                    addToast({
                        message: "Push subscription disabled successfully.",
                        type: "success",
                        duration: 5000,
                    })
                    active.value = false
                }
            })
            .catch((error) => {
                addToast({
                    message: `Unsubscribe failed: ${error}`,
                    type: "error",
                    duration: 5000,
                })
            })
    }

    return { subscribe, unsubscribe, active }
}

const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

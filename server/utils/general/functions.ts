import { consola } from "consola";
import webpush from "web-push";

import { importEncryptSecret } from 'uncsrf'

export const useMakePagination = (itemsPerPage: number = 16, page: number = 1) => {

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    return { items: itemsPerPage, start, end }

}

export const types: FileType[] = [
    { extension: "png", label: "Afbeelding", color: "#1e40af", background: "#eff6ff" },
    { extension: "jpg", label: "Afbeelding", color: "#1e40af", background: "#eff6ff" },
    { extension: "jpeg", label: "Afbeelding", color: "#1e40af", background: "#eff6ff" },
    { extension: "gif", label: "Afbeelding", color: "#1e40af", background: "#eff6ff" },
    { extension: "webp", label: "Afbeelding", color: "#1e40af", background: "#eff6ff" },
    { extension: "pdf", label: "PDF Document", color: "#991b1b", background: "#fef2f2" },
    { extension: "doc", label: "Word Document", color: "#3730a3", background: "#eef2ff" },
    { extension: "docx", label: "Word Document", color: "#3730a3", background: "#eef2ff" },
    { extension: "xls", label: "Excel Document", color: "#166534", background: "#f0fdf4" },
    { extension: "xlsx", label: "Excel Document", color: "#166534", background: "#f0fdf4" },
    { extension: "ppt", label: "PowerPoint", color: "#9a3412", background: "#fff7ed" },
    { extension: "pptx", label: "PowerPoint", color: "#9a3412", background: "#fff7ed" },
    { extension: "txt", label: "Tekst Document", color: "#1f2937", background: "#f9fafb" },
    { extension: "zip", label: "ZIP Archief", color: "#6b21a8", background: "#faf5ff" },
];

const getProperty = (types: FileType[], extension: string, property: "label" | "color" | 'background'): string => {
    const type = types.find((type) => type.extension === extension.toLowerCase());
    return type ? type[property] : "";
}

export const getIconColor = (types: FileType[], extension: string): string => getProperty(types, extension, "color");
export const getIconBackground = (types: FileType[], extension: string): string => getProperty(types, extension, "background");
export const getTypeLabel = (types: FileType[], extension: string): string => getProperty(types, extension, "label");

export const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];
    const base = 1024;

    const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));
    const size = bytes / Math.pow(base, unitIndex);

    return `${size.toFixed(2)} ${units[unitIndex]}`;
};


const useGetVapidDetails = async () => {

    const { vapidPublicKey, vapidPrivateKey } = useRuntimeConfig()

    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        vapidPublicKey,
        vapidPrivateKey
    );

    const server = useSupaBaseServer()
    const { data: subscriptions, error } = await server.from('subscriptions').select("*")

    if (error) return { data: null, error }

    return { data: subscriptions, error: null }

}

export const useSendServiceWorkerPushEvent = async (payload: any) => {

    const { data: subscriptions, error } = await useGetVapidDetails()

    if (!error) for (const data of subscriptions) {

        const endpoint = useDecryptValue(data.endpoint)
        const keys = useDecryptValue(data.keys, true)

        webpush.sendNotification({ 
            endpoint: endpoint, keys: keys 
        }, JSON.stringify(payload))

        .catch(error => {

            const { message, statusMessage } = (useStatusCodes[error.statusCode]) || { message: "", statusMessage: "" };

            consola.error(
                '[Notification] Error sending notification:\n' +
                JSON.stringify({
                    user_id: data.user_id,
                    subscription_id: data.id,
                    statusCode: error.statusCode,
                    statusMessage: statusMessage,
                    message: message,
                    time_caused_at: new Date().toLocaleString(),
                }, null, 2)
            )

        })
        
    }

};

export const useGetSubscriptionProviderUrl = (endpoint: string) => {
    const parts = endpoint.split("/")
    return `${parts[0]}//${parts[2]}`
}

let secretKey: Awaited<ReturnType<typeof importEncryptSecret>>
export const useSecretKey = async (options: ModuleOptions) => secretKey
    ? secretKey
    : (secretKey = await importEncryptSecret(options.encryptSecret, options.encryptAlgorithm))
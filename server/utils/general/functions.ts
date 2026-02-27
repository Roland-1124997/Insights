import { url } from "inspector";
import webpush from "web-push";

export const useMakePagination = (itemsPerPage: number = 16, page: number = 1) => {

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage - 1;

    return { items: itemsPerPage, start, end }

}

export const types: FileType[] = [
    { extension: "png",     label: "Afbeelding",        color: "#1e40af",   background: "#eff6ff" },
    { extension: "jpg",     label: "Afbeelding",        color: "#1e40af",   background: "#eff6ff" },
    { extension: "jpeg",    label: "Afbeelding",        color: "#1e40af",   background: "#eff6ff" },
    { extension: "gif",     label: "Afbeelding",        color: "#1e40af",   background: "#eff6ff" },
    { extension: "webp",    label: "Afbeelding",        color: "#1e40af",   background: "#eff6ff" },
    { extension: "pdf",     label: "PDF Document",      color: "#991b1b",   background: "#fef2f2" },
    { extension: "doc",     label: "Word Document",     color: "#3730a3",   background: "#eef2ff" },
    { extension: "docx",    label: "Word Document",     color: "#3730a3",   background: "#eef2ff" },
    { extension: "xls",     label: "Excel Document",    color: "#166534",   background: "#f0fdf4" },
    { extension: "xlsx",    label: "Excel Document",    color: "#166534",   background: "#f0fdf4" },
    { extension: "ppt",     label: "PowerPoint",        color: "#9a3412",   background: "#fff7ed" },
    { extension: "pptx",    label: "PowerPoint",        color: "#9a3412",   background: "#fff7ed" },
    { extension: "txt",     label: "Tekst Document",     color: "#1f2937",   background: "#f9fafb" },
    { extension: "zip",     label: "ZIP Archief",       color: "#6b21a8",   background: "#faf5ff" },
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

export const useSendNotification = async (payload: any, user_id: string) => {

    const { vapidPublicKey, vapidPrivateKey } = useRuntimeConfig()

    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        vapidPublicKey,
        vapidPrivateKey
    );

    const server = useSupaBaseServer()
    const { data, error } = await server.from('subscriptions').select("*").eq("user_id", user_id).single()

    if (error) return;

    const body = JSON.stringify({
        title: payload.data.subject,
        message: (payload.data.preview as string).substring(0, 100) + "...",
        url: `/berichten?id=${payload.data.id}`,
        unseen: payload.unseen,
    })

    webpush.sendNotification(data.subscription as any, body)
        .then(() => console.log('Notification sent'))
        .catch(err => console.error('Error sending notification:', err));

};
const fetchBlob = async (url: string): Promise<{ data: Blob | null; error: any }> =>
    await useApiHandler(url).Get<Blob>({ responseType: "blob" });

const createBlobLink = (blob: Blob, filename: string, mimetype?: string) => {
    const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: mimetype }));
    const link = document.createElement("a");

    link.href = blobUrl;
    link.setAttribute("download", filename);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
};



export const useStorage = defineStore("useStorage", () => {

    const { create, close } = useModal();
    const { addToast } = useToast();
    const { clear, get, LastEntry, set } = useHistory();


    const uri = "/api/storage";
    const Request = useApiHandler<ApiResponse<Record<string, FileData[]>>>(uri);
    
    const count = ref<Number>(0);
    const files = ref<Record<string, FileData[]>>({});
    const error = ref<ErrorResponse | null | any>(null);
    const loading = ref<boolean>(true);

    const refresh = async (params?: {
        filter?: string; page?: number, search?: string
    }) => {

        const route = useRoute();
        loading.value = true;

        await new Promise(resolve => setTimeout(resolve, 300));

        const { data, error: Error } = await Request.Get({
            query: {
                page: params?.page || route.query.page || 1,
                filter: params?.filter || route.query.filter || 'alles',
                search: params?.search !== undefined ? params.search : (route.query.search || '')
            },
        });

        if (!Error && data) {
            loading.value = false;
            files.value = data.data ?? {};
            count.value = Object.values(data.data ?? {}).flat().length;
        }

        else {
            loading.value = false;
            error.value = Error;
            addToast({
                message: "Er is een fout opgetreden bij het verversen van de bestanden.",
                type: "error",
            });
        }
    };

    const initialPayload = async () => {

        loading.value = true;

        const route = useRoute();
        const activePage = route.path === '/mediabank'

        const params = {
            page: activePage ? (route.query.page || 1) : 1,
            filter: activePage ? (route.query.filter || 'alles') : 'alles',
            search: activePage ? (route.query.search || '') : ''
        } as { filter: string; page: number; search: string };

        set('/mediabank', [params]);
        const { data, error: Error } = await useFetch<ApiResponse<Record<string, FileData[]>>>(uri, {
            query: { ...params },
        });

        if (!Error.value && data.value) {
            loading.value = false;
            files.value = data.value?.data || {};
            count.value = Object.values(data.value?.data || {}).flat().length;
        }

        else {
            loading.value = false;
            error.value = Error.value;
            addToast({
                message: "Er is een fout opgetreden bij het ophalen van bestanden.",
                type: "error",
            });
        }
    };

    const upload = async (fileList: FileList) => {

        const formData = new FormData();

        addToast({
            message: "Je bestanden worden geüpload.",
            type: "info",
        });

        const filesArray = Array.from(fileList);
        filesArray.forEach((file) => {
            formData.append(file.name.replaceAll(" ", "-"), file);
        });

        const { error } = await Request.Post({ body: formData });

        if (error) return addToast({
            message: "Er is een fout opgetreden tijdens het uploaden van je bestanden.",
            type: "error",
        });

        addToast({
            message: "Je bestanden zijn succesvol geüpload.",
            type: "success",
        });

        await refresh();
    };

    const patch = async (file: FileData) => {

        const { error } = await Request.Patch({
            extends: `/${file.id}`,
            body: { published: !file.published },
        });

        if (error) return addToast({
            message: "Er is een fout opgetreden tijdens het bijwerken van het bestand.",
            type: "error",
            duration: 5000,
        });

        addToast({
            message: `Bestand ${!file.published ? "succesvol zichtbaar gemaakt" : "succesvol verborgen"}.`,
            type: "info",
        });

        await refresh();
    };

    const remove = async (file: FileData) => {

        const onComplete = async () => {
            close(); 
            await refresh();
        }

        const onCancel = () => close();
        
        create({
            name: file.name,
            description: "Weet je zeker dat je dit bestand wilt verwijderen? Dit kan niet ongedaan worden gemaakt.",
            component: "Confirm",
            props: { 
                onCancel, 
                onComplete,
                request: {
                    url: `/api/storage/${file.id}`,
                    method: "DELETE",
                    secure: false,
                },
                message: {
                    success: "Bestand succesvol verwijderd.",
                    confirm: "Ja, verwijder het bestand",
                    cancel: "Nee, behoud het bestand",
                },
            },
        });
    };

    const preview = async (file: FileData) => {
        navigateTo(`/mediabank/${file.id}`);
    };

    const download = async (file: FileData, options?: { mimetype?: string }) => {
        const { data, error } = await fetchBlob(file.media);

        if (error || !data) return addToast({
            message: "Failed to download file.",
            type: "error",
            duration: 5000,
        });

        createBlobLink(data, file.name, options?.mimetype);
    };

    return {
        count,
        files,
        error,
        loading,
        refresh,
        initialPayload,
        upload,
        patch,
        remove,
        download,
        preview,
    };
});


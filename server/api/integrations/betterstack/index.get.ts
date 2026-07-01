const { betterstackSourceToken } = useRuntimeConfig();

const headers = { Authorization: `Bearer ${betterstackSourceToken}` };
const baseUrl = `https://uptime.betterstack.com/api/v2`;

const Sections = new Map<number, { name: string; position: number }>();

const useFetchSections = async () => {
	const url = `${baseUrl}/status-pages/228653/sections`;

	await $fetch<Record<string, any>>(url, { headers }).then((data) => {
		data.data.forEach((section: { id: number; attributes: { name: string; position: number } }) => {
			Sections.set(Number(section.id), { name: section.attributes.name, position: section.attributes.position });
		});
	});
};

const useFetchResources = async () => {
	const url = `${baseUrl}/status-pages/228653/resources`;

	let data: Record<string, any> | null = null;
	let error = null;

	try {
		data = await $fetch<Record<string, any>>(url, { headers });
	} catch (err) {
		error = err;
	}

	return { data, error };
};

export default defineSupabaseEventHandler(async (event) => {
	const search = String((getQuery(event).search as string) ?? "").toLowerCase();

	const { data, error } = await useFetchResources();

	if (error && !data?.data) return useReturnResponse(event, internalServerError);

	await useFetchSections();

	const monitors: MonitorResource[] =
		data?.data
			.map((monitor: MonitorResource) => {
				const id = monitor.attributes.status_page_section_id;
				const section = Sections.get(id);

				return {
					position: section?.position,
					...monitor,
					attributes: {
						...monitor.attributes,
						status_page_section_name: section?.name ?? null,
					},
				};
			})

			.filter((monitor: MonitorResource) => {
				const monitor_name = monitor.attributes?.public_name?.toLowerCase().includes(search);
				const group_name = monitor.attributes?.status_page_section_name?.toLowerCase().includes(search);

				return monitor_name || group_name;
			}) ?? [];

	const sortedMonitors = monitors.sort((a, b) => {
		const posA = a.position ?? 0;
		const posB = b.position ?? 0;

		return posA - posB;
	});

	const result = Object.groupBy(sortedMonitors, (monitor: MonitorResource) => {
		const sectionName = monitor.attributes.status_page_section_name ?? null;
		return `${sectionName}`;
	});

	return useReturnResponse(event, {
		status: {
			code: 200,
			message: "Monitors fetched successfully",
			success: true,
		},
		data: {
			count: monitors.length,
			monitors: result,
		},
	});
});

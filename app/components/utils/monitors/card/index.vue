<template>
	<div class="relative w-full p-2 overflow-hidden">
		<div class="relative flex items-start justify-between gap-3">
			<div class="min-w-0">
				<h2 class="text-base font-bold text-gray-900 capitalize truncate md:text-lg">
					{{ monitor.attributes.public_name }}
				</h2>
				<p class="mt-1 text-sm font-medium text-gray-600 line-clamp-2">
					{{ monitor.attributes.explanation || "Geen beschrijving" }}
				</p>
			</div>

			<span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full whitespace-nowrap" :class="statusBadgeClass">
				<span class="w-1.5 h-1.5 rounded-full" :class="isOperational(monitor.attributes.status) ? 'bg-emerald-500' : 'bg-rose-500'"></span>
				{{ monitor.attributes.status }}
			</span>
		</div>

		<div class="relative grid grid-cols-3 gap-2 mt-4 text-sm">
			<div class="col-span-3 p-3 rounded-xl md:p-4 bg-gray-50 group-hover:bg-gray-100">
				<div class="flex items-center justify-between mb-2">
					<h3 class="text-sm font-semibold text-gray-700">Historie ({{ days }}d)</h3>
					<p class="text-xs text-gray-700">Klik voor info</p>
				</div>
				<div class="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-0.5 md:gap-1">
					<div v-for="value in visibleHistory" :key="value.day" class="w-full aspect-square">
						<button
							:disabled="IsNotMonitored(value.status)"
							@click="showIndividualStatus(value.day)"
							class="relative flex items-center justify-center w-full h-full p-1 transition-all duration-200 rounded md:p-2 md:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1"
							:class="historyCellClass(value.status, value.day === individualStatus.day)"
							:title="`${value.day}: ${value.status}`"></button>
					</div>
				</div>
			</div>

			<div class="p-3 rounded-xl bg-gray-50 group-hover:bg-gray-100">
				<h3 class="font-semibold text-gray-700">Uptime</h3>
				<p class="mt-1 text-lg font-bold text-gray-900">{{ availabilityPercentage }}</p>
			</div>
			<div class="p-3 rounded-xl bg-gray-50 group-hover:bg-gray-100">
				<h3 class="font-semibold text-gray-700">Incidenten</h3>
				<p class="mt-1 text-lg font-bold text-gray-900">{{ downtimeIncidents }}</p>
			</div>
			<div class="p-3 rounded-xl bg-gray-50 group-hover:bg-gray-100">
				<h3 class="font-semibold text-gray-700">Downtime</h3>
				<p class="mt-1 text-lg font-bold text-gray-900">{{ useFormatDuration(totalDowntimeSeconds, true) }}</p>
			</div>

			<div class="col-span-3 p-3 md:col-span-2 rounded-xl bg-gray-50 group-hover:bg-gray-100">
				<h3 class="font-semibold text-gray-700">
					<NuxtTime :datetime="individualStatus.day" locale="nl" day="2-digit" month="short" year="numeric" />
				</h3>
				<p class="mt-1 text-sm text-gray-600">
					Status:
					<span class="font-semibold capitalize" :class="isOperational(individualStatus.status) ? 'text-emerald-700' : IsNotMonitored(individualStatus.status) ? 'text-gray-700' : 'text-rose-700'">{{
						individualStatus.status
					}}</span>
				</p>
				<p class="mt-1 text-sm text-gray-600">Downtime: {{ useFormatDuration(individualStatus.downtime_duration, true) }}</p>
				<p class="mt-1 text-sm text-gray-600">Onderhoud: {{ useFormatDuration(individualStatus.maintenance_duration, true) }}</p>
			</div>

			<div class="col-span-3 p-3 md:col-span-1 rounded-xl bg-gray-50 group-hover:bg-gray-100">
				<h3 class="font-semibold text-gray-700">Laatste incident</h3>
				<template v-if="latestIncident">
					<p class="mt-1 text-sm text-gray-600">
						<NuxtTime :datetime="latestIncident.day" locale="nl" day="2-digit" month="short" year="numeric" />
					</p>
					<p class="mt-1 text-sm text-gray-600">
						Status:
						<span class="font-semibold capitalize text-rose-700">{{ latestIncident.status }}</span>
					</p>
					<p class="mt-1 text-sm text-gray-600">Downtime: {{ useFormatDuration(latestIncident.downtime_duration, true) }}</p>
				</template>
				<p v-else class="mt-1 text-sm text-emerald-700">Geen incidenten</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	const { monitor, days } = defineProps({
		monitor: {
			type: Object as () => MonitorResource,
			required: true,
		},
		days: {
			type: Number,
			default: 42,
		},
	});

	const visibleHistory = computed(() => monitor.attributes.status_history.slice(-days));
	const availabilityPercentage = computed(() => `${(monitor.attributes.availability * 100).toFixed(2)}%`);
	const totalDowntimeSeconds = computed(() => visibleHistory.value.reduce((total, item) => total + item.downtime_duration, 0));
	const downtimeIncidents = computed(() => visibleHistory.value.filter((item) => (!isOperational(item.status) && !IsNotMonitored(item.status)) || item.downtime_duration > 0).length);
	const latestIncident = computed<StatusHistoryItem | null>(() => {
		return [...visibleHistory.value].reverse().find((item) => (!isOperational(item.status) && !IsNotMonitored(item.status)) || item.downtime_duration > 0) || null;
	});

	const selectedDay = ref(visibleHistory.value.at(-1)?.day || "");

	watch(
		visibleHistory,
		(history) => {
			if (!history.some((item) => item.day === selectedDay.value)) {
				selectedDay.value = history.at(-1)?.day || "";
			}
		},
		{ immediate: true },
	);

	const individualStatus = computed<StatusHistoryItem>(() => {
		return (
			visibleHistory.value.find((item) => item.day === selectedDay.value) ||
			visibleHistory.value.at(-1) || {
				day: "",
				status: "operational",
				downtime_duration: 0,
				maintenance_duration: 0,
			}
		);
	});

	const isOperational = (status: string) => status === "operational";
	const IsNotMonitored = (status: string) => status === "not_monitored";

	const showIndividualStatus = (day: string) => (selectedDay.value = day);

	const statusBadgeClass = computed(() => (isOperational(monitor.attributes.status) ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"));

	const historyCellClass = (status: string, isSelected: boolean) => {
		let base = "";
		let additional = "";

		if (IsNotMonitored(status)) base = "bg-gray-200 cursor-not-allowed";
		else if (isOperational(status)) base = "bg-emerald-500 hover:bg-emerald-500 focus:ring-emerald-400 hover:scale-105";
		else base = "bg-rose-500 hover:bg-rose-500 focus:ring-rose-400 hover:scale-105";

		if (isSelected) {
			if (IsNotMonitored(status)) additional = "ring-offset-1 ring-2 ring-gray-200";
			else if (isOperational(status)) additional = "ring-offset-1 ring-2 ring-emerald-400";
			else additional = "ring-offset-1 ring-2 ring-rose-400";
		}

		return `${base} ${isSelected ? additional : ""}`;
	};
</script>

interface ModalOptions {
	name: string;
	description: string;
	component: "FormSelect" | "FormInputUrl" | "Confirm" | "Email" | "Totp";
	props: Record<string, any>;
	hideOnDesktop?: boolean;
	hideCloseButton?: boolean;
}

const content = ref<ModalOptions>();
const opened = ref(false);

const isVisible = ref(false);
const isFullyVisible = ref(false);

const hideOnDesktop = ref(false);

watch(opened, (value) => {
	if (value) {
		isVisible.value = value;
		setTimeout(() => {
			isFullyVisible.value = value;
		}, 300);
	} else {
		isFullyVisible.value = value;
		setTimeout(() => {
			isVisible.value = value;
		}, 100);
	}
});

export const useTestModal = () => {
	const create = (options: ModalOptions) => {
		content.value = {
			name: options.name,
			description: options.description || "",
			component: options.component,
			hideCloseButton: options.hideCloseButton || false,
			props: options.props || {},
		};

		if (options.hideOnDesktop) hideOnDesktop.value = true;
		else hideOnDesktop.value = false;

		opened.value = true;
	};

	const close = () => {
		opened.value = false;
	};

	return {
		hideOnDesktop,
		content,
		isVisible,
		isFullyVisible,
		create,
		close,
	};
};

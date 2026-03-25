import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const defaultMessage = "Dit veld is verplicht";
const defaultEmailMessage = "Vul een geldig e-mailadres in";
const contentField = zod.any({ message: defaultMessage });
const length8Field = "Moet minimaal 8 tekens lang zijn";

const loginFields = {
	email: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).email({ message: defaultEmailMessage }),

	password: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).min(8, { message: length8Field }),
};

const notificationField = {
	content: contentField,

	referentie: zod.string().optional(),

	email: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).email({ message: defaultEmailMessage }),

	onderwerp: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }),
};

const articleField = {
	content: contentField,

	topics: zod.array(zod.string()).min(1, { message: defaultMessage }),

	anchors: zod
		.array(
			zod.object({
				id: zod.string(),
				itemIndex: zod.number(),
				level: zod.number(),
				textContent: zod.string(),
			}),
		)
		.optional(),

	description: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }),

	title: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }),

	words: zod.number({ invalid_type_error: defaultMessage }).min(1, { message: defaultMessage }),
};

const mulfiFactorField = {
	code: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).length(6, { message: "De code moet uit 6 cijfers bestaan" }),
};

const optionalString = zod.string().optional();

const navigatorField = {
	ip: zod.string(),
	screen: zod.string(),
	language: zod.string(),
};

const fileMetaField = {
	title: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).max(100, { message: "Mag niet langer zijn dan 100 tekens" }),

	alt: zod.string({ message: defaultMessage }).nonempty({ message: defaultMessage }).max(250, { message: "Mag niet langer zijn dan 250 tekens" }),
};

const subscriptionField = {
	endpoint: zod.string(),
	keys: zod.object({
		p256dh: zod.string(),
		auth: zod.string(),
	}),
};

export const schema = {
	login: {
		backend: zod.object(loginFields),
		frontend: toTypedSchema(zod.object(loginFields)),
	},

	notification: {
		backend: zod.object(notificationField),
		frontend: toTypedSchema(zod.object(notificationField)),
	},

	article: {
		backend: zod.object(articleField),
		frontend: toTypedSchema(zod.object(articleField)),
	},

	totp: {
		backend: zod.object(mulfiFactorField),
		frontend: toTypedSchema(zod.object(mulfiFactorField)),
		optional: {
			frontend: toTypedSchema(
				zod.object({
					code: optionalString,
				}),
			),
		},
	},

	navigator: {
		backend: zod.object(navigatorField),
		frontend: toTypedSchema(zod.object(navigatorField)),
	},

	fileMeta: {
		backend: zod.object(fileMetaField),
		frontend: toTypedSchema(zod.object(fileMetaField)),
	},

	subscription: {
		backend: zod.object(subscriptionField),
		frontend: toTypedSchema(zod.object(subscriptionField)),
	},
};

export type SchemaType = (typeof schema)[keyof typeof schema]["frontend"];
export type BackendSchemaType = (typeof schema)[keyof typeof schema]["backend"];

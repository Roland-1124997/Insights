import { H3Event } from "h3";

export const useReturnResponse = (event: H3Event, data: ApiResponse<Record<string, any>>) => {
	setResponseStatus(event, data.status.code);
	return { ...data };
};

export const internalServerError = {
	status: {
		success: false,
		message: "Internal Server Error",
		code: 500,
	},
};

export const notFoundError = {
	status: {
		success: false,
		message: "Not Found",
		code: 404,
	},
};

export const forbiddenError = {
	status: {
		success: false,
		message: "Forbidden",
		code: 403,
	},
};

export const unauthorizedError = {
	status: {
		success: false,
		message: "Unauthorized",
		code: 401,
	},
};

export const ResourceGoneError = {
	status: {
		success: false,
		message: "Gone",
		code: 410,
	},
};

export const badRequestError = {
	status: {
		success: false,
		message: "Bad Request",
		code: 400,
	},
};

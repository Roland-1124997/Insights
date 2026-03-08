import type { ZodIssue } from 'zod';
import type { AuthError } from '@supabase/auth-js';
import type { FormActions } from 'vee-validate';

export type FetchUrl = Parameters<typeof $fetch>[0];

export type SendOptions = {
    extends?: FetchUrl;
} & Parameters<typeof $fetch>[1];

export type MethodOptions = Omit<SendOptions, 'method'>;

export type Status = {
    success: boolean;
    redirect?: string;
    refresh?: boolean;
    message: string;
    code: number;
};

export type Meta = {
    id: string;
    name?: string;
    description?: string;
};

export type Pagination = {
    page: number;
    total: number;
};

export type ErrorResponse = {
    type: 'fields' | 'auth';
    details: ZodIssue[] | AuthError | object;
};

export type ApiResponse<T> = {
    status: Status;
    meta?: Meta;
    pagination?: Pagination;
    data?: T | null;
    error?: ErrorResponse;
};

export type requestOptions<T = unknown> = {
    url: FetchUrl;
    method: SendOptions['method'];
    successMessage?: string;
    onsuccess?: (response: ApiResponse<T>) => Promise<void> | void;
    onfailure?: (error: ErrorResponse, actions: FormActions<any>) => void;
};
import type { ZodIssue } from 'zod';
import type { AuthError } from '@supabase/auth-js';

import type { Store } from "pinia";
import type { FormActions } from 'vee-validate';

export type { SubmissionHandler } from 'vee-validate';
export type { Editor } from "@tiptap/core";

export type FetchUrl = Parameters<typeof $fetch>[0];
export type SendOptions = {
    extends?: FetchUrl;
} & Parameters<typeof $fetch>[1];

export type MethodOptions = Omit<SendOptions, 'method'>

export type MetaData = {
    size: number;
    label: string;
    mimetype: string;
    created_at: string;
    updated_at: string;
    icon: {
        color: string;
        background: string;
    }
}

export type FileData = {
    id: string;
    name: string;
    published: boolean;
    media: string;
    metadata: MetaData
}

export type FileType = {
    extension: string;
    label: string;
    color: string;
    background: string;
}

export type Status = {
    success: boolean;
    redirect?: string,
    refresh?: boolean,
    message: string;
    code: number;
}

export type Meta = {
    id: string;
    name?: string;
    description?: string;
}

export type Pagination = {
    page: number;
    total: number;
}

export type ErrorResponse = {
    type: 'fields' | 'auth';
    details: ZodIssue[] | AuthError | object
}

export type ApiResponse<T> = {
    status: Status;
    meta?: Meta;
    pagination?: Pagination;
    data?: T | null;
    error?: ErrorResponse;
}

export type requestOptions<T = unknown> = {
    url: FetchUrl;
    method: SendOptions['method'];
    successMessage?: string;
    onsuccess?: (response: ApiResponse<T>) => Promise<void> | void;
    onfailure?: (error: ErrorResponse, actions: FormActions<any>) => void
}

export type Anchor = {
    id: string;
    level: number;
    itemIndex: number;
    textContent: string;
};

export type search = {
    label: string,
    placeholder: string,
}

export type Filters = {
    type: string,
    iconName: string,
    label: string,
    shortLabel: string,
    alwaysShowLabel: boolean,
    ariaLabel: string,
    color: string,
    large: boolean,
}

export type Buttons = {
    iconName?: string,
    to?: string,
    description?: string,
    isSmall?: boolean,
    isButton?: boolean,
    onClick?: 'triggerFileSelect' | 'refresh' | 'subscribe' | 'unsubscribe'
}

export type ToolBar = {
    groupWithFilters?: boolean;
    fallbackFilter?: string;
    buttons?: Buttons[];
    filters?: Filters[];
    search?: search;
    store: string;
}

export type RouteType = {
    label: string;
    iconName: string;
    refetchOnEnter?: boolean;
    alert?: boolean;
    toolbar?: ToolBar;
};

export type StoreType = Store<string, {
    refresh?: (params?: {
        filter?: string;
        page?: number;
        search?: string;
    }) => Promise<void>;
    alert?: { value: number };
    loading: boolean;
    error: any | null;
}>;

export type HistoryEntry = { 
    search: string | null
    filter: string | null 
    page: string | number | null
};

export type RouteHistory = Record<string, HistoryEntry[]>;


export type UserDisplay = {
    id: string
    session: string
    email: string
    factors?: {
        verified: boolean
        enabled: boolean
    }
    mfa_needs_to_verified?: boolean

}

export type UserSession = {
    id: string;
    created_at: string;
    updated_at: string;
    ip_address: string | null;
    continent_code: string | null;
    timezone: string | null;
    country_code: string | null;
    region_code: string | null;
    city: string | null;
    screen: string | null;
};
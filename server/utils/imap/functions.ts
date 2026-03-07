import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { JSDOM } from 'jsdom';

import type { FetchMessageObject, FetchQueryObject, FetchOptions } from 'imapflow';

const { IMAP_HOST, IMAP_PORT, IMAP_SECURE, IMAP_USER, IMAP_PASS } = useRuntimeConfig();

export const sanitizeHtml = (html: string) => html
    
export const useConnectClient = async () => {

    let error = null;
    let data = null;

    const client = new ImapFlow({
        host: IMAP_HOST,
        port: Number(IMAP_PORT),
        secure: IMAP_SECURE === 'true',
        tls: {
            rejectUnauthorized: false
        },
        auth: {
            user: IMAP_USER,
            pass: IMAP_PASS,
        },
        logger: false
    });

    try { 
        await client.connect() 
        data = client;
    }

    catch (err) {
        error = err;
    }

    return { imap_client: data, imap_error: error };

}

export const useCloseImapClient = async (client: ImapFlow) => {
    await client.logout();
}

export const useGetImapMailbox = async (client: ImapFlow, mailbox: string) => {
    return await client.mailboxOpen(mailbox);
}

export const useReleaseImapMailbox = async (lock: any) => {
    lock.release();
}

export const buildResponse = async (message: FetchMessageObject, threadmap: Map<string, string>) => {
    let html = '';
    let preview = '';
    let attachments = [];
    let previewText = '';

    if (!message.source) return null;

    const emailSubject = message.envelope?.subject;
    const stripedSubject = emailSubject?.split(':')[1]?.trim() || emailSubject?.trim();

    if (stripedSubject) {
        threadmap.set(stripedSubject, threadmap.get(stripedSubject) || crypto.randomUUID());
        message.threadId = threadmap.get(stripedSubject);
    }

    const mail = await simpleParser(message.source);

    const document = new JSDOM(mail.html || '');
    const body = document.window.document.body

    body.querySelectorAll('p').forEach((element, index) => {
        if (index < 3) previewText += element.textContent + ' ';
    });

    html = sanitizeHtml(mail.html || "") || mail.textAsHtml || '';

    attachments = mail.attachments;
    preview = previewText || mail.text || mail.textAsHtml || '';
    preview = preview
        .replace(/https?:\/\/[^\s]+/g, '')
        .replace(/\[/g, '')
        .replace(/\]/g, '')
        .replace(/\)/g, ') ')
        .replace(/\s+/g, ' ')
        .trim()

    return {
        id: message.id,
        threadId: message.threadId || null,
        uid: message.uid,
        subject: message.envelope?.subject,
        date: message.envelope?.date,
        from: message.envelope?.from?.[0],
        flags: message.flags ? Array.from(message.flags) : [],
        attachments, preview, html,
        references: mail.references || null,
    };
}

export const useFetchImapSingleMessage = async (client: ImapFlow, search: number | string, fetchOptions: FetchQueryObject, options?: FetchOptions) => {
    const threadmap = new Map<string, string>();

    const msg = await client.fetchOne(search, fetchOptions, options);
    if (msg) return await buildResponse(msg, threadmap);
    

    return null;
}

export const useFetchImapMessages = async (client: ImapFlow, criteria: any, fetchOptions: any) => {
    const messages = [];
    const threadmap = new Map<string, string>();

    for await (let message of client.fetch(criteria, fetchOptions)) {
        const response = await buildResponse(message, threadmap);
        if (response) {
            messages.push(response);
        }
    }

    return messages.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

}




export const useAddMessageFlags = async (client: ImapFlow, search: any, flags: string[]) => {

    let data = null;
    let error = null;

    await client.messageFlagsAdd(search, flags).then((response) => {
        data = response;
    }).catch((err) => {
        error = err;
    });

    return { data, error };
}

export const useRemoveMessageFlags = async (client: ImapFlow, search: any, flags: string[]) => {

    let data = null;
    let error = null;

    await client.messageFlagsRemove(search, flags).then((response) => {
        data = response;

    }).catch((err) => {
        error = err;
    });

    return { data, error };
}

export const useDeleteMessage = async (client: ImapFlow, search: any) => {
    let data = null;
    let error = null;

    await client.messageDelete(search).then((response) => {
        data = response;
    }).catch((err) => {
        error = err;
    });

    return { data, error };
}

export const unseenMessagesCount = async (client: ImapFlow) => {
    const count = await client.search({ seen: false });
    return count === false ? 0 : count.length;
}

export const makeImapPagination = (totalItems: number, currentPage: number, itemsPerPage: number) => {
    const total = Math.ceil(totalItems / itemsPerPage);
    const page = currentPage

    const end = totalItems - (page - 1) * itemsPerPage;
    const start = Math.max(end - itemsPerPage + 1, 1);

    return { page, total, start, end };
}

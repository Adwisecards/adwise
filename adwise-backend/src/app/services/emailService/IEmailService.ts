import { Result } from "../../core/models/Result";

export interface IEmailWithPlainText {
    from: string;
    to: string;
    subject: string;
    text: string;
};

export interface IEmailWithHTML {
    from: string;
    to: string;
    subject: string;
    html: string;
};

export type EmailServiceLocalization = 'en' | 'ru'

export interface IEmailService {
    sendWithPlainText(to: string, type: string, values: any, attachments?: {filename: string; data: Buffer;}[], localization?: EmailServiceLocalization): Promise<Result<boolean | null, boolean | null>>;
    sendToMultipleWithPlainText(to: string[], type: string, values: any, attachments?: {filename: string; data: Buffer;}[], localization?: EmailServiceLocalization): Promise<Result<boolean | null, boolean | null>>;
    // sendWithHTML(to: string, type: string, values: any, attachments?: {filename: string; data: Buffer;}[]): Promise<Result<boolean | null, boolean | null>>;
};
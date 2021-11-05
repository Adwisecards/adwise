import Mailgun from 'mailgun-js';
import { Result } from "../../../core/models/Result";
import { logger } from '../../logger';
import { EmailServiceLocalization, IEmailService } from "../IEmailService";
import en from './localization/en';
import ru from './localization/ru';


export class EmailService implements IEmailService {
    private mailgunDomain: string;
    private mailgunApiKey: string;
    private from: string;
    private mailgun: Mailgun.Mailgun;
    private isProd: boolean;

    constructor(mailgunDomain: string, mailgunApiKey: string, from: string, isProd: boolean) {
        this.mailgunApiKey = mailgunApiKey;
        this.mailgunDomain = mailgunDomain;
        this.from = from;
        this.mailgun = new Mailgun({
            apiKey: this.mailgunApiKey,
            domain: this.mailgunDomain
        });
        this.isProd = isProd;
    }

    private emails = {
        en: en,
        ru: ru
    };

    public sendWithPlainText(to: string, type: string, values: any, attachments?: {filename: string; data: Buffer;}[], localization?: EmailServiceLocalization): Promise<Result<boolean | null, boolean | null>> {
        return this.sendWithHTML(to, type, values, attachments, localization);
        
        // return new Promise((resolve) => {
        //     this.mailgun.messages().send({
        //         to,
        //         from: this.from,
        //         subject: (<any>this.emails)[type].subject,
        //         text: this.executeTemplate((<any>this.emails)[type].body, values)
        //     }, (err, _) => {
        //         if (err) {
        //             logger.info(err);
        //             return resolve(Result.fail(true));
        //         } else {
        //             return resolve(Result.ok(true));
        //         }
        //     });
        // });
    }
    
    public sendToMultipleWithPlainText(to: string[], type: string, values: any, attachments?: {filename: string; data: Buffer;}[], localization?: EmailServiceLocalization): Promise<Result<boolean | null, boolean | null>> {
        return this.sendWithHTML(to, type, values, attachments, localization);
        
        // return new Promise((resolve) => {
        //     this.mailgun.messages().send({
        //         to,
        //         from: this.from,
        //         subject: (<any>this.emails)[type].subject,
        //         text: this.executeTemplate((<any>this.emails)[type].body, values)
        //     }, (err, _) => {
        //         if (err) {
        //             console.log(err);
        //             return resolve(Result.fail(true));
        //         } else {
        //             return resolve(Result.ok(true));
        //         }
        //     });
        // });
    }

    public sendWithHTML(to: string | string[], type: string, values: any, attachments?: {filename: string; data: Buffer;}[], localization?: EmailServiceLocalization): Promise<Result<boolean | null, boolean | null>> {
        to = typeof to == 'string' ? [to] : to;

        logger.info(`EMAIL SERVICE: Sending email ${type} in ${localization} to ${to.join(', ')} with ${attachments?.length || 0} attachments`);
        return new Promise((resolve) => {
            if (!this.isProd) {
                logger.info(`EMAIL SERVICE: Email was blocked due to environment`);
                return resolve(Result.ok(true));
            }

            localization = localization || 'ru';

            this.mailgun.messages().send({
                to: to,
                from: this.from,
                subject: (<any>this.emails)[localization][type].subject,
                template:'new_template',
                'h:X-Mailgun-Variables': JSON.stringify({
                    heading: (<any>this.emails)[localization][type].subject,
                    text: this.executeTemplate((<any>this.emails)[localization][type].body, values)
                }),
                attachment: attachments ? attachments.map(a => {
                    return new this.mailgun.Attachment({
                        filename: a.filename,
                        data: a.data
                    });
                }) : undefined
            }, (err, _) => {
                if (err) {
                    logger.error('', `EMAIL SERVICE: Error upon sending email`, err.message);
                    return resolve(Result.fail(true));
                } else {
                    logger.info(`EMAIL SERVICE: Email was successfully sent`);
                    return resolve(Result.ok(true));
                }
            });
        });
    }

    private executeTemplate(body: string, data: any) {
        const executedBody = body.replace(/\$(\w+)/ig, (_, p1) => {
            return data[p1] || 'undefined';
        });
        return executedBody;
    }
}
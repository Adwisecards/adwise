import { Result } from "../../../core/models/Result";
import { logger } from "../../logger";
import { ISmsService, SmsServiceLocalization } from "../ISmsService";
import en from "./localization/en";
import ru from "./localization/ru";
const SMSru = require('sms_ru');

export class SmsService implements ISmsService {
    private smsruKey: string;
    private smsru: typeof SMSru;
    private isProd: boolean;

    constructor(smsruKey: string, isProd: boolean) {
        this.smsruKey = smsruKey;
        this.smsru = new SMSru(this.smsruKey);
        this.isProd = isProd;
    }

    private sms = {
        en: en,
        ru: ru
    }

    public async send(to: string, type: string, values: any, localization?: SmsServiceLocalization): Promise<Result<boolean | null, boolean | null>> {        
        localization = localization || 'ru';

        return new Promise(resolve => {
            logger.info(`SMS SERVICE: Sending sms ${type} in ${localization} to ${to}`);

            if (!this.isProd) {
                logger.info(`SMS SERVICE: Sms was blocked due to environment`);
                return resolve(Result.ok(true));
            }

            this.smsru.sms_send({
                to,
                text: this.executeTemplate((<any>this.sms)[localization!][type], {
                    ...values
                }),
                from: 'AdWise'
              }, function(e: any){
                    if (Number.parseInt(e.code) >= 200) {
                        logger.error('', `SMS SERVICE: Error upon sending sms`, e.message);
                        return resolve(Result.fail(true));
                    } else {
                        logger.info(`SMS SERVICE: Sms was successfully sent`);
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
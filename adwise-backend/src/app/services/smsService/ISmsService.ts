import { Result } from "../../core/models/Result";

export type SmsServiceLocalization = 'en' | 'ru';

export interface ISmsService {
    send(to: string, type: string, values: any, localization?: SmsServiceLocalization): Promise<Result<boolean | null, boolean | null>>;
};
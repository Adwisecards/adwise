import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateGlobalShopDTO {
    export interface Request {
        billingDescriptor: string;
        fullName: string;
        name: string;
        inn: string;
        kpp: string;
        ogrn: string;
        addresses: {
            type: 'legal' | 'actual' | 'post' | 'other';
            zip: string;
            country: 'RUS';
            city: string;
            street: string;
        }[];
        phones: {
            type: 'common' | 'fax' | 'other';
            phone: string;
        }[];
        email: string;
        ceo: {
            firstName: string;
            lastName: string;
            middleName: string;
            birthDate: string;
            phone: string;
        };
        bankAccount: {
            account: string;
            korAccount: string;
            bankName: string;
            bik: string;
            details: string;
            tax: number;
        };
    };

    export interface ResponseData {
        globalId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IApp } from "../../../models/App";
import { IGlobal } from "../../../models/Global";

export namespace UpdateGlobalDTO {
    export interface Request {
        purchasePercent: number;
        managerPercent: number;
        managerPoints: number;
        contactEmail: string;
        spareContactEmails: string[];
        balanceUnfreezeTerms: number;
        technicalWorks: boolean;
        tipsMinimalAmount: number;
        minimalPayment: number;
        maximumPayment: number;
        paymentGatewayPercent: number;
        paymentGatewayMinimalFee: number;
        paymentRetention: number;
        app: IApp;
    };

    export interface ResponseData {
        global: IGlobal;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
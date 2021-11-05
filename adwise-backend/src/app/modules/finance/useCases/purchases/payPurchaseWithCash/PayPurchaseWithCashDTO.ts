import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPayment } from "../../../models/Payment";

export namespace PayPurchaseWithCashDTO {
    export interface Request {
        purchaseId: string;
        usedPoints: number;
        comment?: string;
    };

    export interface ResponseData {
        payment: IPayment;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
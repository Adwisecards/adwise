import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPayment } from "../../../models/Payment";

export namespace SendTipsDTO {
    export interface Request {
        userId: string;
        sum: number;
        cashierUserId: string;
        purchaseId: string;
    };

    export interface ResponseData {
        payment: IPayment;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
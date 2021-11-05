import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPayment } from "../../../models/Payment";

export namespace CreatePaymentDTO {
    export interface Request {
        ref: string;
        sum: number;
        currency: string;
        type: string;
        usedPoints: number;
        shopId: string;
        safe?: boolean;
    };

    export interface ResponseData {
        payment: IPayment;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
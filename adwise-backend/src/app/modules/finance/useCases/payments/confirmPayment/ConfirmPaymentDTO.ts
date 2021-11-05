import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPayment } from "../../../models/Payment";

export namespace ConfirmPaymentDTO {
    export interface Request {
        paymentId: string;
    };

    export interface ResponseData {
        payment: IPayment;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
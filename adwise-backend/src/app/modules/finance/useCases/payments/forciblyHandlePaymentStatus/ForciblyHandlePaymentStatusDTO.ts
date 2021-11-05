import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace ForciblyHandlePaymentStatusDTO {
    export interface Request {
        paymentId: string;
    };

    export interface ResponseData {
        paymentId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
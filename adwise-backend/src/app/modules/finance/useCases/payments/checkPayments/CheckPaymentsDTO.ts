import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CheckPaymentsDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        paymentIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
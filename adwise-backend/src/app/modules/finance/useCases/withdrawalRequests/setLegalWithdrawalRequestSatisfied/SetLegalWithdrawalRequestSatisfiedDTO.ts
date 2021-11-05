import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetLegalWithdrawalRequestSatisfiedDTO {
    export interface Request {
        withdrawalRequestId: string;
    };

    export interface ResponseData {
        withdrawalRequestId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
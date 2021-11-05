import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateWithdrawalRequestDTO {
    export interface Request {
        withdrawalRequestId: string;
        sum: number;
        comment: string;
        timestamp: string;
    };

    export interface ResponseData {
        withdrawalRequestId: string;
    };

    export type Response = Result<ResponseData | null, | UseCaseError | null>;
};
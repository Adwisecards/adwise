import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateLegalWithdrawalRequestDTO {
    export interface Request {
        sum: number;
        walletId: string;
        userId: string;
        comment: string;
        timestamp: string;
    };

    export interface ResponseData {
        withdrawalRequestId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
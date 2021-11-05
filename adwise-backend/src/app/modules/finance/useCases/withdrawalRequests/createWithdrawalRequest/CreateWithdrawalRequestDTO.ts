import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateWithdrawalRequestDTO {
    export interface Request {
        withdrawalRequestToken: string;
        taskId: string;
        cryptowalletAddress: string;
    };

    export interface ResponseData {
        withdrawalRequestId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
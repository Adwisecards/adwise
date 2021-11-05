import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateWithdrawalRequestTokenDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        withdrawalRequestToken: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
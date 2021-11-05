import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CorrectBalanceDTO {
    export interface Request {
        walletId: string;
        type: string;
        change: number;
    };

    export interface ResponseData {
        walletId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
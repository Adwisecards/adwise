import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetWalletBalanceDTO {
    export interface Request {
        walletId: string;
        userId: string;
    };

    export interface ResponseData {
        points: number;
        frozenPoints: number;
        currency: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetWalletDepositDTO {
    export interface Request {
        deposit: number;
        walletId: string;
        userId: string;
        isAdmin: boolean;
    };

    export interface ResponseData {
        walletId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
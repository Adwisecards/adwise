import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DepositWalletDTO {
    export interface Request {
        userId: string;
        sumInPoints: number;
    };

    export interface ResponseData {
        walletId: string;
    };

    export type Response = Result<DepositWalletDTO.ResponseData | null, UseCaseError | null>;
};
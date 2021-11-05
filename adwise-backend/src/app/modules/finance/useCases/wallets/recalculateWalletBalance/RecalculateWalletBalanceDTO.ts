import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransaction } from "../../../models/Transaction";

export namespace RecalculateWalletBalanceDTO {
    export interface Request {
        walletIds?: string[];
        transaction?: ITransaction;
    };

    export interface ResponseData {
        walletIds: string[]; 
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
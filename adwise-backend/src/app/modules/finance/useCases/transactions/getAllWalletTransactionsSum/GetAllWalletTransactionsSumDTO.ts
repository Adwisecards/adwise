import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransaction } from "../../../models/Transaction";

export namespace GetAllWalletTransactionsSumDTO {
    export interface Request {
        walletId: string;
        transaction?: ITransaction;
    };

    export interface ResponseData {
        points: number;
        cashbackPoints: number;
        bonusPoints: number;
        deposit: number;
        frozenPoints: any;
        frozenPointsSum: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
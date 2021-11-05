import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransaction } from "../../../models/Transaction";

export interface ITransactionAccumulationService {
    accumulate(transaction: ITransaction): Result<boolean | null, Error | null>;
    recalculate(context: string): Promise<Result<string[] | null, Error | null>>;
};
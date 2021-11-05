import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { logger } from "../../../../../services/logger";
import { ITransaction } from "../../../models/Transaction";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { RecalculateWalletBalanceUseCase } from "../../wallets/recalculateWalletBalance/RecalculateWalletBalanceUseCase";
import { UnfreezeTransactionsDTO } from "./UnfreezeTransactionsDTO";
import { unfreezeTransactionsErrors } from "./unfreezeTransactionsErrors";

export class UnfreezeTransactionsUseCase implements IUseCase<UnfreezeTransactionsDTO.Request, UnfreezeTransactionsDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private recalculateWalletBalanceUseCase: RecalculateWalletBalanceUseCase;
    
    public errors = unfreezeTransactionsErrors;

    constructor(
        transactionRepo: ITransactionRepo,
        recalculateWalletBalanceUseCase: RecalculateWalletBalanceUseCase
    ) {
        this.transactionRepo = transactionRepo;
        this.recalculateWalletBalanceUseCase = recalculateWalletBalanceUseCase;
    }

    public async execute(_: UnfreezeTransactionsDTO.Request): Promise<UnfreezeTransactionsDTO.Response> {
        const frozenTransactionsGotten = await this.getFrozenTransactions();
        if (frozenTransactionsGotten.isFailure) {
            return Result.fail(frozenTransactionsGotten.getError());
        }

        const frozenTransactions = frozenTransactionsGotten.getValue()!;

        const transactionIds: string[] = [];
        
        for (const frozenTransaction of frozenTransactions) {
            const transactionUnfrozen = await this.unfreezeTransaction(frozenTransaction);
            if (transactionUnfrozen.isFailure) {
                const error = transactionUnfrozen.getError()!;
                logger.error(error.stack!, error.message, error.details);
            
                continue;
            }

            transactionIds.push(frozenTransaction._id.toString());
        }

        return Result.ok({transactionIds});
    }

    private async unfreezeTransaction(transaction: ITransaction): Promise<Result<ITransaction | null, UseCaseError | null>> {
        const date = new Date();
        
        if (transaction.dueDate.getTime() > date.getTime()) {
            return Result.ok(transaction);
        }

        transaction.frozen = false;

        const transactionSaved = await this.transactionRepo.save(transaction);
        if (transactionSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving transaction'));
        }

        if (!transaction.disabled) {
            const walletsToBeRecalculated = [];

            if (transaction.from) {
                walletsToBeRecalculated.push(transaction.from.toString());
            }

            if (transaction.to) {
                walletsToBeRecalculated.push(transaction.to.toString());
            }

            if (walletsToBeRecalculated.length) {
                await this.recalculateWalletBalanceUseCase.execute({
                    walletIds: walletsToBeRecalculated,
                    transaction: transaction
                });
            }
        }

        return Result.ok(transaction);
    }

    private async getFrozenTransactions(): Promise<Result<ITransaction[] | null, UseCaseError | null>> {
        const transactionsFound = await this.transactionRepo.findManyByFrozen(true);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon finding frozen transactions"));
        }

        const transactions = transactionsFound.getValue()!;

        return Result.ok(transactions);
    }
}
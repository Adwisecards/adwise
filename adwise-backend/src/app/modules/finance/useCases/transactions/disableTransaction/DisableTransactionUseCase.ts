import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { logger } from "../../../../../services/logger";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { RecalculateWalletBalanceUseCase } from "../../wallets/recalculateWalletBalance/RecalculateWalletBalanceUseCase";
import { DisableTransactionDTO } from "./DisableTransactionDTO";
import { disableTransactionErrors } from "./disableTransactionErrors";

export class DisableTransactionUseCase implements IUseCase<DisableTransactionDTO.Request, DisableTransactionDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private recalculateWalletBalanceUseCase: RecalculateWalletBalanceUseCase;

    public errors = [
        ...disableTransactionErrors
    ];

    constructor(transactionRepo: ITransactionRepo, recalculateWalletBalanceUseCase: RecalculateWalletBalanceUseCase) {
        this.transactionRepo = transactionRepo;
        this.recalculateWalletBalanceUseCase = recalculateWalletBalanceUseCase;
    }

    public async execute(req: DisableTransactionDTO.Request): Promise<DisableTransactionDTO.Response> {
        if (!Types.ObjectId.isValid(req.transactionId)) {
            return Result.fail(UseCaseError.create('c', 'transactionId is not valid'));
        }

        if (typeof req.disabled != 'boolean') {
            return Result.fail(UseCaseError.create('c',' disabled is not valid'));
        }

        const transactionFound = await this.transactionRepo.findById(req.transactionId);
        if (transactionFound.isFailure) {
            return Result.fail(transactionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding transaction') : UseCaseError.create('b', 'Transaction does not exist'));
        }

        const transaction = transactionFound.getValue()!;

        if (transaction.disabled == req.disabled) {
            return Result.fail(UseCaseError.create('c', 'Transaction is already in this state'));
        }

        transaction.disabled = req.disabled;
        
        const transactionSaved = await this.transactionRepo.save(transaction);
        if (transactionSaved.isFailure) {
            console.log(transactionSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving transaction'));
        }

        logger.infoWithMeta('Transaction disabled', {transaction: transaction.toObject()});
        
        const walletsToBeRecalculated = [];

        if (transaction.from) {
            walletsToBeRecalculated.push(transaction.from.toString());
        }

        if (transaction.to) {
            walletsToBeRecalculated.push(transaction.to.toString());
        }

        if (walletsToBeRecalculated.length) {
            this.recalculateWalletBalanceUseCase.execute({
                walletIds: walletsToBeRecalculated,
                transaction: transaction
            });
        }

        return Result.ok({transactionId: req.transactionId});
    }
}
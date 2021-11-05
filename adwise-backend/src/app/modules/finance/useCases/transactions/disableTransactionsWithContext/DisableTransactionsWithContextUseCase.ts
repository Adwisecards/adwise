import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { DisableTransactionUseCase } from "../disableTransaction/DisableTransactionUseCase";
import { DisableTransactionsWithContextDTO } from "./DisableTransactionsWithContextDTO";
import { disableTransactionsWithContextErrors } from "./disableTransactionsWithContextErrors";

export class DisableTransactionsWithContextUseCase implements IUseCase<DisableTransactionsWithContextDTO.Request, DisableTransactionsWithContextDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private disableTransactionUseCase: DisableTransactionUseCase;

    public errors = disableTransactionsWithContextErrors;

    constructor(transactionRepo: ITransactionRepo, disableTransactionUseCase: DisableTransactionUseCase) {
        this.transactionRepo = transactionRepo;
        this.disableTransactionUseCase = disableTransactionUseCase;
    }

    public async execute(req: DisableTransactionsWithContextDTO.Request): Promise<DisableTransactionsWithContextDTO.Response> {
        if (!req.context) {
            return Result.fail(UseCaseError.create('c', 'context is not valid'));
        }

        const transactionsFound = await this.transactionRepo.findByContexts([req.context]);
        if (transactionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding transactions'));
        }

        const transactions = transactionsFound.getValue()!;

        const transactionIds: string[] = [];

        for (const transaction of transactions) {
            await this.disableTransactionUseCase.execute({
                disabled: true,
                transactionId: transaction._id.toString()
            })

            transactionIds.push(transaction._id.toString());
        }

        return Result.ok({transactionIds});
    }
}
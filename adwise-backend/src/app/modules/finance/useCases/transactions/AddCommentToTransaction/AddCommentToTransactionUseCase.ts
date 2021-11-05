import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransactionRepo } from "../../../repo/transactions/ITransactionRepo";
import { ITransactionValidationService } from "../../../services/transactions/transactionValidationService/ITransactionValidationService";
import { AddCommentToTransactionDTO } from "./AddCommentToTransactionDTO";
import { addCommentToTransactionErrors } from "./addCommentToTransactionErrors";

export class AddCommentToTransactionUseCase implements IUseCase<AddCommentToTransactionDTO.Request, AddCommentToTransactionDTO.Response> {
    private transactionRepo: ITransactionRepo;
    private transactionValidationService: ITransactionValidationService;

    public errors = addCommentToTransactionErrors;

    constructor(
        transactionRepo: ITransactionRepo,
        transactionValidationService: ITransactionValidationService
    ) {
        this.transactionRepo = transactionRepo;
        this.transactionValidationService = transactionValidationService;
    }

    public async execute(req: AddCommentToTransactionDTO.Request): Promise<AddCommentToTransactionDTO.Response> {
        const valid = this.transactionValidationService.addCommentToTransactionData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const transactionFound = await this.transactionRepo.findById(req.transactionId);
        if (transactionFound.isFailure) {
            return Result.fail(transactionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding transaction') : UseCaseError.create('b', 'Transaction does not exist'));
        }

        const transaction = transactionFound.getValue()!;

        transaction.comment = req.comment;

        const transactionSaved = await this.transactionRepo.save(transaction);
        if (transactionSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving transaction'));
        }

        return Result.ok({transactionId: transaction._id.toString()});
    }
}
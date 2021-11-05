import { transactionRepo } from "../../../repo/transactions";
import { transactionValidationService } from "../../../services/transactions/transactionValidationService";
import { AddCommentToTransactionController } from "./AddCommentToTransactionController";
import { AddCommentToTransactionUseCase } from "./AddCommentToTransactionUseCase";

export const addCommentToTransactionUseCase = new AddCommentToTransactionUseCase(
    transactionRepo,
    transactionValidationService
);

export const addCommentToTransactionController = new AddCommentToTransactionController(addCommentToTransactionUseCase);
import { purchaseRepo } from "../../../repo/purchases";
import { transactionRepo } from "../../../repo/transactions";
import { disableTransactionUseCase } from "../../transactions/disableTransaction";
import { setPurchasePaidUseCase } from "../setPurchasePaid";
import { NormalizePurchasesUseCase } from "./NormalizePurchasesUseCase";

export const normalizePurchasesUseCase = new NormalizePurchasesUseCase(
    purchaseRepo, 
    transactionRepo, 
    setPurchasePaidUseCase,
    disableTransactionUseCase
);
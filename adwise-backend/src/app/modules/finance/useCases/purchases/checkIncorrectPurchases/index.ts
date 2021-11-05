import { purchaseRepo } from "../../../repo/purchases";
import { transactionRepo } from "../../../repo/transactions";
import { CheckIncorrectPurchasesUseCase } from "./CheckIncorrectPurchasesUseCase";

export const checkIncorrectPurchasesUseCase = new CheckIncorrectPurchasesUseCase(purchaseRepo, transactionRepo);
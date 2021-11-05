import { purchaseRepo } from "../../../../app/modules/finance/repo/purchases";
import { createPurchaseUseCase } from "../../../../app/modules/finance/useCases/purchases/createPurchase";
import { CreatePurchasesTest } from "./CreatePurchasesTest";

export const createPurchasesTest = new CreatePurchasesTest(
    purchaseRepo,
    createPurchaseUseCase
);
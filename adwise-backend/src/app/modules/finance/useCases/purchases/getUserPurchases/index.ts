import { purchaseRepo } from "../../../repo/purchases";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { GetUserPurchasesController } from "./GetUserPurchasesController";
import { GetUserPurchasesUseCase } from "./GetUserPurchasesUseCase";

const getUserPurchasesUseCase = new GetUserPurchasesUseCase(purchaseRepo, purchaseValidationService);
const getUserPurchasesController = new GetUserPurchasesController(getUserPurchasesUseCase);

export {
    getUserPurchasesUseCase,
    getUserPurchasesController
};
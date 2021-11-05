import { userRepo } from "../../../../users/repo/users";
import { purchaseRepo } from "../../../repo/purchases";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { SetPurchaseArchivedController } from "./SetPurchaseArchivedController";
import { SetPurchaseArchivedUseCase } from "./SetPurchaseArchivedUseCase";

export const setPurchaseArchivedUseCase = new SetPurchaseArchivedUseCase(
    userRepo,
    purchaseRepo,
    purchaseValidationService
);

export const setPurchaseArchivedController = new SetPurchaseArchivedController(setPurchaseArchivedUseCase);
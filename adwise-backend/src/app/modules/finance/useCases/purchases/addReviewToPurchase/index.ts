import { purchaseRepo } from "../../../repo/purchases";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { AddReviewToPurchaseController } from "./AddReviewToPurchaseController";
import { AddReviewToPurchaseUseCase } from "./AddReviewToPurchaseUseCase";

export const addReviewToPurchaseUseCase = new AddReviewToPurchaseUseCase(purchaseRepo, purchaseValidationService);
export const addReviewToPurchaseController = new AddReviewToPurchaseController(addReviewToPurchaseUseCase);
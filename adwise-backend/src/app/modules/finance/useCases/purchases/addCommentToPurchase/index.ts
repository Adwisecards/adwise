import { purchaseRepo } from "../../../repo/purchases";
import { AddCommentToPurchaseController } from "./AddCommentToPurchaseController";
import { AddCommentToPurchaseUseCase } from "./AddCommentToPurchaseUseCase";

export const addCommentToPurchaseUseCase = new AddCommentToPurchaseUseCase(purchaseRepo);
export const addCommentToPurchaseController = new AddCommentToPurchaseController(addCommentToPurchaseUseCase);
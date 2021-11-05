import { offerRepo } from "../../../repo/offers";
import { purchaseRepo } from "../../../repo/purchases";
import { TransformPurchasesUseCase } from "./TransformPurchasesUseCase";

export const transformPurchasesUseCase = new TransformPurchasesUseCase(purchaseRepo, offerRepo);
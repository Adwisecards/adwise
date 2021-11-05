import { purchaseRepo } from "../../../repo/purchases";
import { purchaseValidationService } from "../../../services/purchases/purchaseValidationService";
import { createPurchaseUseCase } from "../createPurchase";
import { CreatePurchaseForClientsController } from "./CreatePurchaseForClientsController";
import { CreatePurchaseForClientsUseCase } from "./CreatePurchaseForClientsUseCase";

export const createPurchaseForClientsUseCase = new CreatePurchaseForClientsUseCase(
    purchaseRepo,
    createPurchaseUseCase,
    purchaseValidationService
);

export const createPurchaseForClientsController = new CreatePurchaseForClientsController(createPurchaseForClientsUseCase);
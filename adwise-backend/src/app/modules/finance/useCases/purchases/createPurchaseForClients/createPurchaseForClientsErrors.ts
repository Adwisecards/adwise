import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { createPurchaseErrors } from "../createPurchase/createPurchaseErrors";

export const createPurchaseForClientsErrors = [
    UseCaseError.create('c'),
    ...createPurchaseErrors
];
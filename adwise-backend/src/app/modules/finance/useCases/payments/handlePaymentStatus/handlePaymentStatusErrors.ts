import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { confirmPurchaseErrors } from "../../purchases/confirmPurchase/confirmPurchaseErrors";

export const handlePaymentStatusErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b'),
    UseCaseError.create('r'),
    UseCaseError.create('m'),
    UseCaseError.create('r'),
    UseCaseError.create('v'),
    UseCaseError.create('6'),
    UseCaseError.create('7'),
    ...confirmPurchaseErrors
];
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { createPaymentErrors } from "../../payments/createPayment/createPaymentErrors";

export const payPurchaseErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('s'),
    UseCaseError.create('c'),
    UseCaseError.create('m'),
    UseCaseError.create('u'),
    UseCaseError.create('r'),
    UseCaseError.create('t'),
    UseCaseError.create('l'),
    ...createPaymentErrors
];
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { createPaymentErrors } from "../../payments/createPayment/createPaymentErrors";

export const payDepositWalletErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('r'),
    UseCaseError.create('m'),
    UseCaseError.create('l'),
    ...createPaymentErrors
];
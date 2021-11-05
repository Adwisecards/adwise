import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const accumulatePaymentErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c')
];
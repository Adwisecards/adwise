import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const forciblyHandlePaymentStatusErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('4')
];
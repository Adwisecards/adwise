import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const disableTransactionErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('b'),
    UseCaseError.create('c')
];
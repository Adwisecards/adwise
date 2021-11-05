import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const fixMissingTransactionsErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('b'),
    UseCaseError.create('c')
];
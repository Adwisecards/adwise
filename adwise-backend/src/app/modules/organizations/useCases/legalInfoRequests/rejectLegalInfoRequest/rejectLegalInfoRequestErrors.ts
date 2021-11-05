import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const rejectLegalInfoRequestErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('a3')
];
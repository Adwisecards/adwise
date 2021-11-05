import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const getOrganizationClientErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('w'),
    UseCaseError.create('b')
];
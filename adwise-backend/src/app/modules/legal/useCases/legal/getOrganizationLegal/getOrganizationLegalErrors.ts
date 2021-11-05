import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const getOrganizationLegalErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('l'),
    UseCaseError.create('b4')
];
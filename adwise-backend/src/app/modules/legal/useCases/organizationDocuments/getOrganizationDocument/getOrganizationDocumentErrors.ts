import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const getOrganizationDocumentErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b3')
];
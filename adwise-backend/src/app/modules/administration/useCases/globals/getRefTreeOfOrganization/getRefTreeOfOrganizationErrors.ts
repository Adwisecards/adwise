import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const getRefTreeOfOrganizationErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b')
];
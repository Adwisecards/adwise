import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const getOrganizationErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('b'),
    UseCaseError.create('c')
];
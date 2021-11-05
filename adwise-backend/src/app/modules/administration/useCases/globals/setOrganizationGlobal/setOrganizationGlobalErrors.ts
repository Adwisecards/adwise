import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const setOrganizationGlobalErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('l')
];
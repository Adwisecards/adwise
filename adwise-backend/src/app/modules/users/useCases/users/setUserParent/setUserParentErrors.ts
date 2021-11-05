import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const setUserParentErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('l')
];
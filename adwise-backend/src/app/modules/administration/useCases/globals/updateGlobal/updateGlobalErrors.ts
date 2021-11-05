import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const updateGlobalErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b')
];
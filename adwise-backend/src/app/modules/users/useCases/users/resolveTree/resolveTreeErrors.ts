import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const resolveTreeErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b')
];
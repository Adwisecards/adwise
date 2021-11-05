import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const getProductErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b')
];
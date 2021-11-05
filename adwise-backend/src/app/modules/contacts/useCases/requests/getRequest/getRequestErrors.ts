import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const getRequestErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('b'),
    UseCaseError.create('c')
];
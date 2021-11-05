import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const getVerificationErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b'),
    UseCaseError.create('a0')
];
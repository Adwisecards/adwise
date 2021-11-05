import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const sendVerificationErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('b'),
    UseCaseError.create('c'),
    UseCaseError.create('5')
];
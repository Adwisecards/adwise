import { UseCaseError } from "../../../../core/models/UseCaseError";

export const getSystemLogFileErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b')
];
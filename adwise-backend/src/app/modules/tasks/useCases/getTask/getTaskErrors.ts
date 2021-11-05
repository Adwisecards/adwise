import { UseCaseError } from "../../../../core/models/UseCaseError";

export const getTaskErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b')
];
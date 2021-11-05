import { UseCaseError } from "../../../../core/models/UseCaseError";

export const transformRefsErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('b')
];
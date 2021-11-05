import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const getEmployeeErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('x')
];
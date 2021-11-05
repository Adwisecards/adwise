import { UseCaseError } from "../../../../core/models/UseCaseError";

export const getRefByCodeErrors = [
    UseCaseError.create('b'),
    UseCaseError.create('a'),
    UseCaseError.create('c')
];
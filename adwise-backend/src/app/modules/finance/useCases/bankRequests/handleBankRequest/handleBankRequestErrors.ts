import { UseCaseError } from "../../../../../core/models/UseCaseError";

export const handleBankRequestErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('m'),
    UseCaseError.create('b')
];
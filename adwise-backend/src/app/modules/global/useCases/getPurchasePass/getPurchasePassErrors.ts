import { UseCaseError } from "../../../../core/models/UseCaseError";
import { logger } from "../../../../services/logger";

export const getPurchasePassErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('s'),
    UseCaseError.create('l')
];
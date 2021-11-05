import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { createVerificationErrors } from "../../verifications/createVerification/createVerificationErrors";

export const createUserErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('f'),
    UseCaseError.create('m'),
    ...createVerificationErrors
];
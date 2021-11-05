import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { deleteContactErrors } from "../../../../contacts/useCases/contacts/deleteContact/deleteContactErrors";

export const deleteEmployeeErrors = [
    UseCaseError.create('a'),
    UseCaseError.create('c'),
    UseCaseError.create('x'),
    UseCaseError.create('w'),
    ...deleteContactErrors
];
import { createOrganizationErrors } from "../../../../organizations/useCases/organizations/createOrganization/createOrganizationErrors";
import { createUserErrors } from "../createUser/createUserErrors";

export const createUserOrganizationErrors = [
    ...createUserErrors,
    ...createOrganizationErrors
];
import { contactRepo } from "../../../../contacts/repo/contacts";
import { organizationRepo } from "../../../repo/organizations";
import { GetOrganizationCashierContactsUseCase } from "./GetOrganizationCashierContactsUseCase";

export const getOrganizationCashierContactsUseCase = new GetOrganizationCashierContactsUseCase(
    organizationRepo,
    contactRepo
);
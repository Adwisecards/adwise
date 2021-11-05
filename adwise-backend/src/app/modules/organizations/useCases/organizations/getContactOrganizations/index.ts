import { contactRepo } from "../../../../contacts/repo/contacts";
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { GetContactOrganizationsController } from "./GetContactOrganizationsController";
import { GetContactOrganizationsUseCase } from "./GetContactOrganizationsUseCase";

export const getContactOrganizationsUseCase = new GetContactOrganizationsUseCase(
    userRepo,
    contactRepo,
    organizationRepo,
    organizationValidationService
);

export const getContactOrganizationsController = new GetContactOrganizationsController(
    getContactOrganizationsUseCase
);
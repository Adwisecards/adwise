import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { legalRepo } from "../../../repo/legal";
import { legalValidationService } from "../../../services/legal/legalValidationService";
import { GetOrganizationLegalsController } from "./GetOrganizationLegalsController";
import { GetOrganizationLegalsUseCase } from "./GetOrganizationLegalsUseCase";

export const getOrganizationLegalsUseCase = new GetOrganizationLegalsUseCase(
    userRepo,
    legalRepo,
    organizationRepo,
    legalValidationService
);

export const getOrganizationLegalsController = new GetOrganizationLegalsController(getOrganizationLegalsUseCase);
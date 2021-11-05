import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { legalRepo } from "../../../repo/legal";
import { legalValidationService } from "../../../services/legal/legalValidationService";
import { GetOrganizationLegalController } from "./GetOrganizationLegalController";
import { GetOrganizationLegalUseCase } from "./GetOrganizationLegalUseCase";

export const getOrganizationLegalUseCase = new GetOrganizationLegalUseCase(
    userRepo,
    legalRepo,
    organizationRepo,
    legalValidationService
);

export const getOrganizationLegalController = new GetOrganizationLegalController(getOrganizationLegalUseCase);
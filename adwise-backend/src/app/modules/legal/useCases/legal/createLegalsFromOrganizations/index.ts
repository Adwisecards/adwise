import { organizationRepo } from "../../../../organizations/repo/organizations";
import { legalRepo } from "../../../repo/legal";
import { createLegalUseCase } from "../createLegal";
import { CreateLegalsFromOrganizationsUseCase } from "./CreateLegalsFromOrganizationsUseCase";

export const createLegalsFromOrganizationsUseCase = new CreateLegalsFromOrganizationsUseCase(
    legalRepo,
    organizationRepo,
    createLegalUseCase
);
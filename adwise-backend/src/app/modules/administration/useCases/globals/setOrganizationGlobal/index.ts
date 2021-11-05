import { organizationRepo } from "../../../../organizations/repo/organizations";
import { globalRepo } from "../../../repo/globals";
import { SetOrganizationGlobalController } from "./SetOrganizationGlobalController";
import { SetOrganizationGlobalUseCase } from "./SetOrganizationGlobalUseCase";

export const setOrganizationGlobalUseCase = new SetOrganizationGlobalUseCase(organizationRepo, globalRepo);
export const setOrganizationGlobalController = new SetOrganizationGlobalController(setOrganizationGlobalUseCase);
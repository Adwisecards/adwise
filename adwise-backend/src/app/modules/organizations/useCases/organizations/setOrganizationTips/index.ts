import { organizationRepo } from "../../../repo/organizations";
import { SetOrganizationTipsController } from "./SetOrganizationTipsController";
import { SetOrganizationTipsUseCase } from "./SetOrganizationTipsUseCase";

export const setOrganizationTipsUseCase = new SetOrganizationTipsUseCase(organizationRepo);
export const setOrganizationTipsController = new SetOrganizationTipsController(setOrganizationTipsUseCase);
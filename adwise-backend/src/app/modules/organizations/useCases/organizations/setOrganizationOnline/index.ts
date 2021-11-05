import { organizationRepo } from "../../../repo/organizations";
import { SetOrganizationOnlineController } from "./SetOrganizationOnlineController";
import { SetOrganizationOnlineUseCase } from "./SetOrganizationOnlineUseCase";

export const setOrganizationOnlineUseCase = new SetOrganizationOnlineUseCase(organizationRepo);
export const setOrganizationOnlineController = new SetOrganizationOnlineController(setOrganizationOnlineUseCase);

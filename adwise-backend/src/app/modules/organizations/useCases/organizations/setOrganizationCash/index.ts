import { organizationRepo } from "../../../repo/organizations";
import { SetOrganizationCashController } from "./SetOrganizationCashController";
import { SetOrganizationCashUseCase } from "./SetOrganizationCashUseCase";

export const setOrganizationCashUseCase = new SetOrganizationCashUseCase(organizationRepo);
export const setOrganizationCashController = new SetOrganizationCashController(setOrganizationCashUseCase);
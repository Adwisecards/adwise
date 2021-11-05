import { legalRepo } from "../../../../legal/repo/legal";
import { organizationRepo } from "../../../repo/organizations";
import { SetOrganizationPaymentTypeController } from "./SetOrganizationPaymentTypeController";
import { setOrganizationPaymentTypeErrors } from "./setOrganizationPaymentTypeErrors";
import { SetOrganizationPaymentTypeUseCase } from "./SetOrganizationPaymentTypeUseCase";

export const setOrganizationPaymentTypeUseCase = new SetOrganizationPaymentTypeUseCase(
    legalRepo,
    organizationRepo
);
export const setOrganizationPaymentTypeController = new SetOrganizationPaymentTypeController(setOrganizationPaymentTypeUseCase);
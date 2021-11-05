import { emailService } from "../../../../../services/emailService";
import { globalRepo } from "../../../../administration/repo/globals";
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { RequestPaymentTypeController } from "./RequestPaymentTypeController";
import { RequestPaymentTypeUseCase } from "./RequestPaymentTypeUseCase";

export const requestPaymentTypeUseCase = new RequestPaymentTypeUseCase(
    userRepo,
    globalRepo,
    emailService,
    organizationRepo,
    organizationValidationService
);

export const requestPaymentTypeController = new RequestPaymentTypeController(requestPaymentTypeUseCase);
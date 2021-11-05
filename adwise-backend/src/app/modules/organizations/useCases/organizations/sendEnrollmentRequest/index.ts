import { emailService } from "../../../../../services/emailService";
import { globalRepo } from "../../../../administration/repo/globals";
import { userRepo } from "../../../../users/repo/users";
import { organizationRepo } from "../../../repo/organizations";
import { packetRepo } from "../../../repo/packets";
import { organizationValidationService } from "../../../services/organizations/organizationValidationService";
import { SendEnrollmentRequestController } from "./SendEnrollmentRequestController";
import { SendEnrollmentRequestUseCase } from "./SendEnrollmentRequestUseCase";

export const sendEnrollmentRequestUseCase = new SendEnrollmentRequestUseCase(
    userRepo,
    globalRepo,
    packetRepo,
    emailService,
    organizationRepo,
    organizationValidationService
);
export const sendEnrollmentRequestController = new SendEnrollmentRequestController(sendEnrollmentRequestUseCase);
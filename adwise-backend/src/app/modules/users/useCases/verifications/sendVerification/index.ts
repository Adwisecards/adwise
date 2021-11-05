import { emailService } from "../../../../../services/emailService";
import { smsService } from "../../../../../services/smsService";
import { userRepo } from "../../../repo/users";
import { verificationRepo } from "../../../repo/verifications";
import { SendVerificationController } from "./SendVerificationController";
import { SendVerificationUseCase } from "./SendVerificationUseCase";

const sendVerificationUseCase = new SendVerificationUseCase(verificationRepo, emailService, smsService, userRepo);
const sendVerificationController = new SendVerificationController(sendVerificationUseCase);

export {
    sendVerificationUseCase,
    sendVerificationController
};
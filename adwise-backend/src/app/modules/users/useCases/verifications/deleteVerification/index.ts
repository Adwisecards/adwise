import { emailService } from "../../../../../services/emailService";
import { smsService } from "../../../../../services/smsService";
import { userRepo } from "../../../repo/users";
import { verificationRepo } from "../../../repo/verifications";
import { DeleteVerificationController } from "./DeleteVerificationController";
import { DeleteVerificationUseCase } from "./DeleteVerificationUseCase";

const deleteVerificationUseCase = new DeleteVerificationUseCase(userRepo, verificationRepo, emailService, smsService);
const deleteVerificationController = new DeleteVerificationController(deleteVerificationUseCase);

export {
    deleteVerificationUseCase,
    deleteVerificationController
};
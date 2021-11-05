import { emailService } from "../../../../../services/emailService";
import { smsService } from "../../../../../services/smsService";
import { restorationRepo } from "../../../repo/restorations";
import { userRepo } from "../../../repo/users";
import { SendRestorationCodeController } from "./SendRestorationCodeController";
import { SendRestorationCodeUseCase } from "./SendRestorationCodeUseCase";

export const sendRestorationCodeUseCase = new SendRestorationCodeUseCase(restorationRepo, emailService, smsService, userRepo);
export const sendRestorationCodeController = new SendRestorationCodeController(sendRestorationCodeUseCase);
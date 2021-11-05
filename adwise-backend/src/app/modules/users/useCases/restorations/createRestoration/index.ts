import { emailService } from "../../../../../services/emailService";
import { smsService } from "../../../../../services/smsService";
import { restorationRepo } from "../../../repo/restorations";
import { userRepo } from "../../../repo/users";
import { userValidationService } from "../../../services/userValidationService";
import { CreateRestorationController } from "./CreateRestorationController";
import { CreateRestorationUseCase } from "./CreateRestorationUseCase";

const createRestorationUseCase = new CreateRestorationUseCase(restorationRepo, userRepo, userValidationService, emailService, smsService);
const createRestorationController = new CreateRestorationController(createRestorationUseCase);

export {
    createRestorationUseCase,
    createRestorationController
};
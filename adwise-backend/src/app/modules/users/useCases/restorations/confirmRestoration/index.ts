import { emailService } from "../../../../../services/emailService";
import { smsService } from "../../../../../services/smsService";
import { restorationRepo } from "../../../repo/restorations";
import { userRepo } from "../../../repo/users";
import { authService } from "../../../services/authService";
import { passwordService } from "../../../services/passwordService";
import { ConfirmRestorationController } from "./ConfirmRestorationController";
import { ConfirmRestorationUseCase } from "./ConfirmRestorationUseCase";

const confirmRestorationUseCase = new ConfirmRestorationUseCase(
    restorationRepo,
    emailService, 
    smsService, 
    userRepo, 
    passwordService,
    authService
);

const confirmRestorationController = new ConfirmRestorationController(confirmRestorationUseCase);

export {
    confirmRestorationUseCase,
    confirmRestorationController
};
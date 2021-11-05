import { userRepo } from "../../../../users/repo/users";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { SetUserAdminGuestController } from "./SetUserAdminGuestController";
import { SetUserAdminGuestUseCase } from "./SetUserAdminGuestUseCase";

export const setUserAdminGuestUseCase = new SetUserAdminGuestUseCase(
    userRepo,
    administrationValidationService
);

export const setUserAdminGuestController = new SetUserAdminGuestController(
    setUserAdminGuestUseCase
);
import { wisewinService } from "../../../../../services/wisewinService";
import { employeeRepo } from "../../../../organizations/repo/employees";
import { userRepo } from "../../../repo/users";
import { authService } from "../../../services/authService";
import { userValidationService } from "../../../services/userValidationService";
import { SignInController } from "./SignInController";
import { SignInUseCase } from "./SignInUseCase";

const signInUseCase = new SignInUseCase(userRepo, userValidationService, authService, employeeRepo);
const signInController = new SignInController(signInUseCase);

export {
    signInUseCase,
    signInController
};
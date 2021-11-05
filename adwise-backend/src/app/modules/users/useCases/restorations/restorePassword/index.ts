import { restorationRepo } from "../../../repo/restorations";
import { userRepo } from "../../../repo/users";
import { RestorePasswordController } from "./RestorePasswordController";
import { RestorePasswordUseCase } from "./RestorePasswordUseCase";

const restorePasswordUseCase = new RestorePasswordUseCase(userRepo, restorationRepo);
const restorePasswordController = new RestorePasswordController(restorePasswordUseCase);

export {
    restorePasswordUseCase,
    restorePasswordController
};
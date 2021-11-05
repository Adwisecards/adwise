import { userRepo } from "../../../../users/repo/users";
import { SetUserAdminController } from "./SetUserAdminController";
import { SetUserAdminUseCase } from "./SetUserAdminUseCase";

const setUserAdminUseCase = new SetUserAdminUseCase(userRepo);
const setUserAdminController = new SetUserAdminController(setUserAdminUseCase);

export {
    setUserAdminUseCase,
    setUserAdminController
};
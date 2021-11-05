import { userRepo } from "../../../repo/users";
import { SetUserRoleController } from "./SetUserRoleController";
import { SetUserRoleUseCase } from "./SetUserRoleUseCase";

export const setUserRoleUseCase = new SetUserRoleUseCase(userRepo);
export const setUserRoleController = new SetUserRoleController(setUserRoleUseCase); 
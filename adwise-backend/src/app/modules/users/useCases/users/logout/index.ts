import { userRepo } from "../../../repo/users";
import { LogoutController } from "./LogoutController";
import { LogoutUseCase } from "./LogoutUseCase";

export const logoutUseCase = new LogoutUseCase(userRepo);
export const logoutController = new LogoutController(logoutUseCase);
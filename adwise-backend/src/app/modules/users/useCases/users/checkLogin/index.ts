import { userRepo } from "../../../repo/users";
import { CheckLoginController } from "./CheckLoginController";
import { CheckLoginUseCase } from "./CheckLoginUseCase";

const checkLoginUseCase = new CheckLoginUseCase(userRepo);
const checkLoginController = new CheckLoginController(checkLoginUseCase);

export {
    checkLoginController,
    checkLoginUseCase
};
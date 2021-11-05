import { userRepo } from "../../../repo/users";
import { GetUserController } from "./GetUserController";
import { GetUserUseCase } from "./GetUserUseCase";

const getUserUseCase = new GetUserUseCase(userRepo);
const getUserController = new GetUserController(getUserUseCase);

export {
    getUserUseCase,
    getUserController
};
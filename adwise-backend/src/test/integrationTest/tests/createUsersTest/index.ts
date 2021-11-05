import { walletRepo } from "../../../../app/modules/finance/repo/wallets";
import { userRepo } from "../../../../app/modules/users/repo/users";
import { createUserUseCase } from "../../../../app/modules/users/useCases/users/createUser";
import { CreateUsersTest } from "./CreateUsersTest";

export const createUsersTest = new CreateUsersTest(
    userRepo,
    walletRepo,
    createUserUseCase
);
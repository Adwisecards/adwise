import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { walletRepo } from "../../../repo/wallets";
import { BindWalletsUseCase } from "./BindWalletsUseCase";

const bindWalletsUseCase = new BindWalletsUseCase(userRepo, organizationRepo, walletRepo);

export {
    bindWalletsUseCase
};
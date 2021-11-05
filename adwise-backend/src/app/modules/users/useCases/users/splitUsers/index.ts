import { wisewinService } from "../../../../../services/wisewinService";
import { subscriptionRepo } from "../../../../finance/repo/subscriptions";
import { transactionRepo } from "../../../../finance/repo/transactions";
import { walletRepo } from "../../../../finance/repo/wallets";
import { createWalletUseCase } from "../../../../finance/useCases/wallets/createWallet";
import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../repo/users";
import { createUserUseCase } from "../createUser";
import { SplitUsersUseCase } from "./SplitUsersUseCase";

const splitUsersUseCase = new SplitUsersUseCase(userRepo, createUserUseCase, organizationRepo, createWalletUseCase, walletRepo, subscriptionRepo, transactionRepo, wisewinService);

export {
    splitUsersUseCase
};
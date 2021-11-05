import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { walletRepo } from "../../../repo/wallets";
import { createPaymentUseCase } from "../../payments/createPayment";
import { PayDepositWalletController } from "./PayDepositWalletController";
import { PayDepositWalletUseCase } from "./PayDepositWalletUseCase";

const payDepositWalletUseCase = new PayDepositWalletUseCase(walletRepo, userRepo, organizationRepo, createPaymentUseCase);
const payDepositWalletController = new PayDepositWalletController(payDepositWalletUseCase);

export {
    payDepositWalletUseCase,
    payDepositWalletController
};
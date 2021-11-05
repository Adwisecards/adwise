import { walletRepo } from "../../../repo/wallets";
import { walletValidationService } from "../../../services/wallets/walletValidationService";
import { CreateWalletUseCase } from "./CreateWalletUseCase";

const createWalletUseCase = new CreateWalletUseCase(
    walletRepo,
    walletValidationService
);

export {
    createWalletUseCase
};
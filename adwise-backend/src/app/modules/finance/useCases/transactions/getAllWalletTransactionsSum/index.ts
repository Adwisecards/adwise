import { organizationRepo } from "../../../../organizations/repo/organizations";
import { userRepo } from "../../../../users/repo/users";
import { transactionRepo } from "../../../repo/transactions";
import { walletRepo } from "../../../repo/wallets";
import { GetAllWalletTransactionsSumController } from "./GetAllWalletTransactionsSumController";
import { GetAllWalletTransactionsSumUseCase } from "./GetAllWalletTransactionsSumUseCase";

const getAllWalletTransactionsUseCase = new GetAllWalletTransactionsSumUseCase(transactionRepo, organizationRepo, userRepo, walletRepo);
const getAllWalletTransactionsController = new GetAllWalletTransactionsSumController(getAllWalletTransactionsUseCase);

export {
    getAllWalletTransactionsUseCase,
    getAllWalletTransactionsController
};
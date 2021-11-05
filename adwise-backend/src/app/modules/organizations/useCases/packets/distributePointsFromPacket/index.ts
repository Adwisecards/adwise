import { currencyService } from "../../../../../services/currencyService";
import { globalRepo } from "../../../../administration/repo/globals";
import { walletRepo } from "../../../../finance/repo/wallets";
import { createTransactionUseCase } from "../../../../finance/useCases/transactions/createTransaction";
import { userRepo } from "../../../../users/repo/users";
import { DistributePointsFromPacketUseCase } from "./DistributePointsFromPacketUseCase";

const distributePointsFromPacketUseCase = new DistributePointsFromPacketUseCase(walletRepo, userRepo, globalRepo, createTransactionUseCase, currencyService);

export {
    distributePointsFromPacketUseCase
};
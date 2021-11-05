import { WalletModel } from "../../models/Wallet";
import { WalletRepo } from "./implementation/WalletRepo";

const walletRepo = new WalletRepo(WalletModel);

export {
    walletRepo
};
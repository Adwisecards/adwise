import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IWallet } from '../../models/Wallet';

export interface IWalletRepo extends IRepo<IWallet> {
    findByFrozenSumDate(date: Date): RepoResult<IWallet[]>;
};
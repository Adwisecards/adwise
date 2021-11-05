import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IWallet, IWalletModel } from "../../../models/Wallet";
import { IWalletRepo } from "../IWalletRepo";

export class WalletRepo extends Repo<IWallet, IWalletModel> implements IWalletRepo {
    public async findByFrozenSumDate(date: Date) {
        try {
            const wallets = await this.Model.find({
                'frozenPoints.timestamp': {$lte: date}
            });

            return Result.ok(wallets);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
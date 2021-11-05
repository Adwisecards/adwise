import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IWithdrawalRequest, IWithdrawalRequestModel } from "../../../models/WithdrawalRequest";
import { IWithdrawalRequestRepo } from "../IWithdrawalRequestRepo";

export class WithdrawalRequestRepo extends Repo<IWithdrawalRequest, IWithdrawalRequestModel> implements IWithdrawalRequestRepo {
    public async findByWalletAndSatisfied(walletId: string, satisfied: boolean, dateFrom?: Date, dateTo?: Date) {
        try {
            const query: any = {wallet: walletId, satisfied: satisfied};

            if (dateFrom) {
                if (!query.timestamp) query.timestamp = {};
                query.timestamp.$gte = dateFrom;
            }

            if (dateTo) {
                if (!query.timestamp) query.timestamp = {};
                query.timestamp.$lte = dateTo;
            }

            const withdrawalRequests = await this.Model.find(query);
            
            return Result.ok(withdrawalRequests);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
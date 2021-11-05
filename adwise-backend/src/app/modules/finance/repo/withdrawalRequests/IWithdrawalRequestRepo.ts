import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IWithdrawalRequest } from "../../models/WithdrawalRequest";

export interface IWithdrawalRequestRepo extends IRepo<IWithdrawalRequest> {
    findByWalletAndSatisfied(walletId: string, satisfied: boolean, dateFrom?: Date, dateTo?: Date): RepoResult<IWithdrawalRequest[]>;
}
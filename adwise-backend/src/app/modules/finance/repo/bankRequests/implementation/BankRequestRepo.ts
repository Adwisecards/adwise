import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IBankRequest, IBankRequestModel } from "../../../models/BankRequest";
import { IBankRequestRepo } from "../IBankRequestRepo";

export class BankRequestRepo extends Repo<IBankRequest, IBankRequestModel> implements IBankRequestRepo {
    public async findByRequestId(requestId: string) {
        try {
            const bankRequest = await this.Model.findOne({requestId});
            if (!bankRequest) {
                return Result.fail(new RepoError('Bank request does not exist', 404));
            }

            return Result.ok(bankRequest);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
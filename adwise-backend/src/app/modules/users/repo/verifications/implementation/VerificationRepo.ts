import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IVerification, IVerificationModel } from "../../../models/Verification";
import { IVerificationRepo } from "../IVerificationRepo";

export class VerificationRepo extends Repo<IVerification, IVerificationModel> implements IVerificationRepo {
    public async findByUser(userId: string) {
        try {
            const verification = await this.Model.findOne({user: userId});
            if (!verification) {
                return Result.fail(new RepoError('Verification not found', 404));
            }

            return Result.ok(verification);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
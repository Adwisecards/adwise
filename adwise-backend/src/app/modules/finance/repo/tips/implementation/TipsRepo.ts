import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ITips, ITipsModel } from "../../../models/Tips";
import { ITipsRepo } from "../ITipsRepo";

export class TipsRepo extends Repo<ITips, ITipsModel> implements ITipsRepo {
    public async findManyTipsByTo(to: string, limit: number, page: number, all: boolean) {
        try {
            const query: any = {to: to, confirmed: true};

            if (all) {
                delete query.confirmed;
            }
            const tips = await this.Model.find(query).limit(limit).skip((page - 1) * limit).sort({timestamp: -1}).populate('to from purchase organization');
            
            return Result.ok(tips);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
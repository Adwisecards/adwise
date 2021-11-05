import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IGlobal, IGlobalModel } from "../../../models/Global";
import { IGlobalRepo } from "../IGlobalRepo";

export class GlobalRepo extends Repo<IGlobal, IGlobalModel> implements IGlobalRepo {
    public async getGlobal() {
        try {
            let global: IGlobal;
            global = (await this.Model.findOne({}))!;
            
            if (!global) {
                global = new this.Model({});
            }

            return Result.ok(global);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
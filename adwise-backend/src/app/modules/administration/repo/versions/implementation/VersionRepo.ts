import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IVersion, IVersionModel } from "../../../models/Version";
import { IVersionRepo } from "../IVersionRepo";

export class VersionRepo extends Repo<IVersion, IVersionModel> implements IVersionRepo {
    public async findByType(type: string) {
        try {
            const versions = await this.Model.find({type: type}).sort({date: -1});

            return Result.ok(versions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
import { Repo } from "../../../../core/models/Repo";
import { RepoError } from "../../../../core/models/RepoError";
import { Result } from "../../../../core/models/Result";
import { IRef, IRefModel } from "../../models/Ref";
import { IRefRepo } from "../IRefRepo";

export class RefRepo extends Repo<IRef, IRefModel> implements IRefRepo {
    public async findByCode(code: string) {
        try {
            const ref = await this.Model.findOne({code: code});
            if (!ref) {
                return Result.fail(new RepoError('Not found', 404));
            }

            return Result.ok(ref);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    };

    public async findLast() {
        try {
            const ref = await this.Model.findOne({}).sort({_id: -1});
            if (!ref) {
                return Result.fail(new RepoError('Ref does not exist', 404));
            }

            return Result.ok(ref);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
};
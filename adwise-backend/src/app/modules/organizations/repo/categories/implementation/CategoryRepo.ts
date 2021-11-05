import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ICategory, ICategoryModel } from "../../../models/Category";

export class CategoryRepo extends Repo<ICategory, ICategoryModel> {
    public async findByName(name: string) {
        try {
            const category = await this.Model.findOne({ name: name });
            if (!category) {
                return Result.fail(new RepoError('Category is not found', 404));
            }

            return Result.ok(category);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
};
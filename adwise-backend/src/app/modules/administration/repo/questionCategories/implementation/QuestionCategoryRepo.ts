import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IQuestionCategory, IQuestionCategoryModel } from "../../../models/QuestionCategory";
import { IQuestionCategoryRepo } from "../IQuestionCategoryRepo";

export class QuestionCategoryRepo extends Repo<IQuestionCategory, IQuestionCategoryModel> implements IQuestionCategoryRepo {
    public async findByName(name: string) {
        try {
            const questionCategory = await this.Model.findOne({name: name});
            
            if (!questionCategory) {
                return Result.fail(new RepoError('Question category does not exist', 404));
            }

            return Result.ok(questionCategory);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
};
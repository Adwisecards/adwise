import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IQuestion, IQuestionModel } from "../../../models/Question";
import { IQuestionRepo } from "../IQuestionRepo";

export class QuestionRepo extends Repo<IQuestion, IQuestionModel> implements IQuestionRepo {
    public async findManyByType(type: string) {
        try {
            const questions = await this.Model.find({type: type}).populate('category');

            return Result.ok(questions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
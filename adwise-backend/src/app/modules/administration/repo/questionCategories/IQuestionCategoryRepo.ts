import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IQuestionCategory } from "../../models/QuestionCategory";

export interface IQuestionCategoryRepo extends IRepo<IQuestionCategory> {
    findByName(name: string): RepoResult<IQuestionCategory>;
};
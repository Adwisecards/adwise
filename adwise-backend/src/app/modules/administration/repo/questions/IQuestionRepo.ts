import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IQuestion } from "../../models/Question";

export interface IQuestionRepo extends IRepo<IQuestion> {
    findManyByType(type: string): RepoResult<IQuestion[]>;
};
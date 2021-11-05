import { Result } from "../../../../core/models/Result";

export interface IQuestionValidationService {
    createQuestionData<T>(data: T): Result<string | null, string | null>;
    updateQuestionData<T>(data: T): Result<string | null, string | null>;
};
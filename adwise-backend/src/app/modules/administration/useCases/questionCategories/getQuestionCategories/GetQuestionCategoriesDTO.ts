import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IQuestionCategory } from "../../../models/QuestionCategory";

export namespace GetQuestionCategoriesDTO {
    export interface Request {

    };

    export interface ResponseData {
        questionCategories: IQuestionCategory[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
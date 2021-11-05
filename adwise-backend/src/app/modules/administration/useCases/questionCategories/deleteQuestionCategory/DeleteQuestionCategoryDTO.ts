import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteQuestionCategoryDTO {
    export interface Request {
        questionCategoryId: string;
    };

    export interface ResponseData {
        questionCategoryId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
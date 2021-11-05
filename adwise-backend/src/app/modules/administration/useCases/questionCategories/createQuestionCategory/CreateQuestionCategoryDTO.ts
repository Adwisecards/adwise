import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateQuestionCategoryDTO {
    export interface Request {
        name: string;
    };

    export interface ResponseData {
        questionCategoryId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
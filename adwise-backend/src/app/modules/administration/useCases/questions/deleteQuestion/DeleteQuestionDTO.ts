import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteQuestionDTO {
    export interface Request {
        questionId: string;
    };

    export interface ResponseData {
        questionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
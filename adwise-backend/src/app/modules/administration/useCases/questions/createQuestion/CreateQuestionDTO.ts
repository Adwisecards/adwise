import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateQuestionDTO {
    export interface Request {
        type: string;
        categoryId: string;
        question: string;
        answer: string;
    };

    export interface ResponseData {
        questionId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
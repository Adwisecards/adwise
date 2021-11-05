import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateQuestionDTO {
    export interface Request {
        questionId: string;
        question: string;
        answer: string;
        categoryId: string  
        type: string;
    };

    export interface ResponseData {
        questionId: string;
    };

    export type Response =  Result<ResponseData | null, UseCaseError | null>;
};
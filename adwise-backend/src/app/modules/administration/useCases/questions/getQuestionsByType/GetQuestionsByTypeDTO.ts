import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IQuestion } from "../../../models/Question";

export namespace GetQuestionsByTypeDTO {
    export interface Request {
        type: string;
    };

    export interface ResponseData {
        questions: IQuestion[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
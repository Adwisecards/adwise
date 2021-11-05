import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetUserLanguageDTO {
    export interface Request {
        userId: string;
        language: string;
    };

    export interface ResponseData {
        userId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
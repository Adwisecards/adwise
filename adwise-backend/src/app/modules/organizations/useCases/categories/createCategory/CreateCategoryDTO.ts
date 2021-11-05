import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateCategoryDTO {
    export interface Request {
        name: string;
    };

    export interface ResponseData {
        categoryId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
import { Result } from "../../../../../core/models/Result"
import { UseCaseError } from "../../../../../core/models/UseCaseError"

export namespace DeleteCategoryDTO {
    export interface Request {
        categoryId: string;
    };

    export interface ResponseData {
        categoryId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
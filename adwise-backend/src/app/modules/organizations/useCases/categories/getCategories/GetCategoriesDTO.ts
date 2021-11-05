import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICategory } from "../../../models/Category";

export namespace GetCategoriesDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        categories: ICategory[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
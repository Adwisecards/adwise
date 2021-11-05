import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITips } from "../../../../finance/models/Tips";

export namespace FindAllTipsDTO {
    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        tips: ITips[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
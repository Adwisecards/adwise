import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IRef } from "../../../../ref/models/Ref";

export namespace FindAllRefsDTO {
    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number
    };

    export interface ResponseData {
        refs: any[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
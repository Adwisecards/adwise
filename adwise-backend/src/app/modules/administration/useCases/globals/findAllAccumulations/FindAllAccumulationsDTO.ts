import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IAccumulation } from "../../../../finance/models/Accumulation";

export namespace FindAllAccumulationsDTO {
    export interface Request {
        [key: string]: string | number;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        accumulations: IAccumulation[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
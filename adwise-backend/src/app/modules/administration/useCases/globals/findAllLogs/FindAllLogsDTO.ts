import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ILog } from "../../../../logs/models/Log";

export namespace FindAllLogsDTO {
    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        logs: ILog[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
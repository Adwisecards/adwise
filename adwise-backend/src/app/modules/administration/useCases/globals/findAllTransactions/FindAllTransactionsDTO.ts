import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransaction } from "../../../../finance/models/Transaction";

export namespace FindAllTransactionsDTO {
    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
        export: boolean;
    };

    export interface ResponseData {
        transactions: ITransaction[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
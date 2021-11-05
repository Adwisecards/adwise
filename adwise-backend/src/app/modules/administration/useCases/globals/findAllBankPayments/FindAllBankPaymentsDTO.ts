import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITransaction } from "../../../../finance/models/Transaction";

export namespace FindAllBankPaymentsDTO {
    export interface Request {
        [key: string]: string | number;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        bankPayments: ITransaction[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
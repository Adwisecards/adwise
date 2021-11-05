import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPayment } from "../../../../finance/models/Payment";

export namespace FindAllPaymentsDTO {
    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
        export: boolean;
    };

    export interface ResponseData {
        payments: IPayment[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
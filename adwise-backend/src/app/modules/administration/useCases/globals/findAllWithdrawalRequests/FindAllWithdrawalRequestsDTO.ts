import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWithdrawalRequest } from "../../../../finance/models/WithdrawalRequest";

export namespace FindAllWithdrawalRequestsDTO {
    export interface Request {
        [key: string]: string | number;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        withdrawalRequests: IWithdrawalRequest[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
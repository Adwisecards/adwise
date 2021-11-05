import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetCashierTipsStatisticsDTO {
    export interface ITips {
        timestamp: Date;
        sum: number;
    };

    export interface Request {
        cashierContactId: string;
    };

    export interface ResponseData {
        tipsSum: number;
        tipsCount: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
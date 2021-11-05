import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetCashierPurchaseStatisticsDTO {
    export interface Request {
        cashierUserId: string;
    };

    export interface ResponseData {
        purchaseCount: number;
        purchaseSum: number;
        points: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
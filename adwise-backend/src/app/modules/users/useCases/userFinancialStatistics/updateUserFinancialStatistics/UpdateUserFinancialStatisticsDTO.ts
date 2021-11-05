import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserFinancialOperation } from '../../../models/UserFinancialStatistics';

export namespace UpdateUserFinancialStatisticsDTO {
    export interface IUserFinancialStatistics {
        bonusSum: number;
        purchaseSum: number;
        refCount: number;
        marketingSum: number;
        usedPointsSum: number;
        withdrawalSum: number;
        managerPercentSum: number;
        operations: IUserFinancialOperation[];
        purchases: number[];
    }
    
    export interface Request {
        userId?: string;
    };

    export interface ResponseData {

    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
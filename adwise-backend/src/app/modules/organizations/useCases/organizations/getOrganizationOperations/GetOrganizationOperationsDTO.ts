import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetOrganizationOperationsDTO {
    export interface IOperation {
        type: 'purchase' | 'deposit' | 'withdrawal';
        sum: number;
        timestamp: Date;

        cashback?: number;
        adwisePoints?: number;
        managerPoints?: number;
        firstLevel?: number;
        otherLevels?: number;
    };

    export interface Request {
        organizationId: string;
        export: boolean;
        limit: number;
        page: number;
        dateFrom: string;
        dateTo: string;
    };

    export interface ResponseData {
        operations:  IOperation[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
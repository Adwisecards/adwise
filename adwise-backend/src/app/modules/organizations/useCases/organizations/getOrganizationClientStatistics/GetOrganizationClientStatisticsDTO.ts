import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetOrganizationClientStatisticsDTO {
    export interface Request {
        organizationId: string;
    };

    export interface ResponseData {
        clientCount: number;
        purchaserCount: number;
        purchaseSum: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
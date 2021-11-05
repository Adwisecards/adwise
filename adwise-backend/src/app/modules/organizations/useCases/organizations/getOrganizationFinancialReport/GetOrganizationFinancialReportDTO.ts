import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetOrganizationFinancialReportDTO {
    export interface Request {
        organizationId: string;
        dateFrom: string;
        dateTo: string;
    };

    export interface ResponseData {
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
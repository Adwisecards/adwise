import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationStatistics } from "../../../models/OrganizationStatistics";

export namespace GetOrganizationStatisticsDTO {
    export interface Request {
        organizationId: string;
    };

    export interface ResponseData {
        organizationStatistics: IOrganizationStatistics;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
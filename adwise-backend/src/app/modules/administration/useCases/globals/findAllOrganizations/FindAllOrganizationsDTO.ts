import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationStatistics } from "../../../../organizations/models/OrganizationStatistics";

export namespace FindAllOrganizationsDTO {
    export interface IOrganizationWithStats extends IOrganization {
        stats: IOrganizationStatistics;
    };

    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
        export: boolean;
    };

    export interface ResponseData {
        organizations: IOrganizationWithStats[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
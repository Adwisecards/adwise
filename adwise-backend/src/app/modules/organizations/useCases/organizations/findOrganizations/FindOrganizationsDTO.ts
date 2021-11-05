import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../models/Organization";

export namespace FindOrganizationsDTO {
    export interface Request {
        search: string;
        limit: number;
        page: number;
        userId: string;
        inCity: boolean;
        categoryIds: string[];
    };

    export interface ResponseData {
        organizations: IOrganization[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
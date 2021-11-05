import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../models/Organization";

export namespace GetContactOrganizationsDTO {
    export interface Request {
        contactId: string;
        userId: string;
        sortBy: string;
        order: number;
        page: number;
        limit: number;
        search?: string; 
        categoryIds: string[];
    };

    export interface ResponseData {
        organizations: IOrganization[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
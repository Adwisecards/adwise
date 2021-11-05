import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../models/Organization";

export namespace GetUserFavoriteOrganizationsDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        organizations: IOrganization[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../models/Organization";

export namespace GetOrganizationDTO {
    export interface Request {
        organizationId: string;
    };

    export interface ResponseData {
        organization: IOrganization;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
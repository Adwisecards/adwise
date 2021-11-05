import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationDocument } from "../../../models/OrganizationDocument";

export namespace GetOrganizationDocumentsDTO {
    export interface Request {
        organizationId: string;
        // userId: string;
        type?: string;
    };
    
    export interface ResponseData {
        organizationDocuments: IOrganizationDocument[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
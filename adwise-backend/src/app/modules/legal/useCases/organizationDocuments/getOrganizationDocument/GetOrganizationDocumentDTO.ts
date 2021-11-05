import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationDocument } from "../../../models/OrganizationDocument";

export namespace GetOrganizationDocumentDTO {
    export interface Request {
        organizationDocumentId: string;
    };

    export interface ResponseData {
        organizationDocument: IOrganizationDocument;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
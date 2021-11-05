import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateOrganizationWithdrawalActDocumentDTO {
    export interface Request {
        organizationIds?: string[];
        period?: number;
    };

    export interface ResponseData {
        organizationDocumentIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError  | null>;
};
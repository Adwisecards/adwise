import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GenerateOrganizationDocumentDTO {
    export type Options = {
        dateFrom?: string;
        dateTo?: string;
    };

    export interface Request {
        organizationId: string;
        userId: string;
        type: string;
        options?: Options;
        asNew?: boolean;
    };

    export interface ResponseData {
        organizationDocumentId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
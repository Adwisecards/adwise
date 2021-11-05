import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetOrganizationDocumentsDTO {
    export interface Request {
        organizationId: string;
        userId: string;
    };

    export interface ResponseData {
        data: Buffer;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
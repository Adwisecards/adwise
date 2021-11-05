import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateLegalInfoRequestDTO {
    export interface Request {
        organizationId: string;
        userId: string;
        addressId: string;
        name: string;
        categoryId: string;
        emails: string[];
        phones: string[];
        comment: string;
        legalId: string;
    };

    export interface ResponseData {
        legalInfoRequestId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
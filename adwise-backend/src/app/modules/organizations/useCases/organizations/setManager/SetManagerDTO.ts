import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetManagerDTO {
    export interface Request {
        userManagerRefCode: string;
        organizationId: string;
    };

    export interface ResponseData {
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
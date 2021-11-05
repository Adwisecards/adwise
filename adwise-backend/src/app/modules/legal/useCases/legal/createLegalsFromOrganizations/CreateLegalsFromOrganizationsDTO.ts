import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateLegalsFromOrganizationsDTO {
    export interface Request {

    };

    export interface ResponseData {
        legalIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
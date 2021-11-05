import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetOrganizationTipsDTO {
    export interface Request {
        organizationId: string;
        tips: boolean;
    };

    export interface ResponseData {
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>; 
};
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetDemoOrganizationJwtDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        jwt: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
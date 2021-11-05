import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace GetOrganizationCitiesDTO {
    export interface Request {

    };

    export interface ResponseData {
        organizationCities: string[];
    };
    
    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
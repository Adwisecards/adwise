import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace GetCountryLegalFormsDTO {
    export interface Request {
        country: string;
    };

    export interface ResponseData {
        legalForms: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
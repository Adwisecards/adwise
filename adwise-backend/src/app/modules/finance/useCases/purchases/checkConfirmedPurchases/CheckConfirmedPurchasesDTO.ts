import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CheckConfirmedPurchasesDTO {
    export interface Request {
        
    };

    export interface ResponseData {

    };

    export type Response = Result<ResponseData |  null, UseCaseError | null>;
};
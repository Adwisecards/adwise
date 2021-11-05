import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace PayAccumulatedPaymentsDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        accumulationIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
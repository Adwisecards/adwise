import { name } from "faker";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace RejectLegalInfoRequestDTO {
    export interface Request {
        legalInfoRequestId: string;
        rejectionReason: string;
    };

    export interface ResponseData {
        legalInfoRequestId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>; 
};
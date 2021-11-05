import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeletePartnerDTO {
    export interface Request {
        partnerId: string;
    };

    export interface ResponseData {
        partnerId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
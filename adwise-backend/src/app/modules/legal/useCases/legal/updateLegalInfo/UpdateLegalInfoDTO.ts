import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateLegalInfoDTO {
    export interface Request {
        organizationId: string;
        userId: string;

        info: any;
    };

    export interface ResponseData {
        legalId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
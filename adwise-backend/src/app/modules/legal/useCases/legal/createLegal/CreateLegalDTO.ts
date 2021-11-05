import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ILegal } from "../../../models/Legal";

export namespace CreateLegalDTO {
    export interface Request {
        organizationId: string;
        userId: string;

        country: string;
        form: string;
        info: any;
        relevant?: boolean;
    };

    export interface ResponseData {
        legalId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
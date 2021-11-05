import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ILegal } from "../../../models/Legal";

export namespace GetOrganizationLegalDTO {
    export interface Request {
        userId: string;
        organizationId: string;
    };

    export interface ResponseData {
        legal: ILegal;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
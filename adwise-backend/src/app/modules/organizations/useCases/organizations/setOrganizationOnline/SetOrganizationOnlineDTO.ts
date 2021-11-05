import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetOrganizationOnlineDTO {
    export interface Request {
        organizationId: string;
        online: boolean;
    };

    export interface ResponseData {
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
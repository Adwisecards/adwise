import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SetAddressCoordsDTO {
    export interface Request {
        userId: string;
        organizationId: string;
        coords: number[];
    };

    export interface ResponseData {
        organizationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
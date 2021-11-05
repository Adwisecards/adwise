import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IVersion } from "../../../models/Version";

export namespace GetVersionsDTO {
    export interface Request {
        type: string;
    };

    export interface ResponseData {
        versions: IVersion[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
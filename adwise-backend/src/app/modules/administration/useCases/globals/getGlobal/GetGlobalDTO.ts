import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobal } from "../../../models/Global";

export namespace GetGlobalDTO {
    export interface Request {
        
    };

    export interface ResponseData {
        global: IGlobal;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
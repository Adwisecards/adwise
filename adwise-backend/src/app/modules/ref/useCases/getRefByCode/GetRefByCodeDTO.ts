import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IRef } from "../../models/Ref";

export namespace GetRefByCodeDTO {
    export interface Request {
        code: string;
    };

    export interface ResponseData {
        ref: IRef;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
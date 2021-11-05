import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IRef } from "../../models/Ref";

export namespace CreateRefDTO {
    export interface Request {
        ref: string;
        mode: string;
        type: string;
    };

    export type Response = Result<IRef | null, UseCaseError | null>;
};
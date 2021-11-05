import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DeleteAdvantageDTO {
    export interface Request {
        advantageId: string;
    };

    export interface ResponseData {
        advantageId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
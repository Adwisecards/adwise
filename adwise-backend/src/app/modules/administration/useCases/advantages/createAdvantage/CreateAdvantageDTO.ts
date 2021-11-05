import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateAdvantageDTO {
    export interface Request {
        pictureMediaId: string;
        name: string;
        index: number;
    };

    export interface ResponseData {
        advantageId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
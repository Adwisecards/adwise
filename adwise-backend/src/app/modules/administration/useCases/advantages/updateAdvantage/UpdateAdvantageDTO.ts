import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdateAdvantageDTO {
    export interface Request {
        advantageId: string;
        pictureMediaId: string;
        name: string;
        index: number;
    };

    export interface ResponseData {
        advantageId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
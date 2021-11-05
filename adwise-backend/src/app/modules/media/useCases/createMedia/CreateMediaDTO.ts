import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace CreateMediaDTO {
    export interface Request {
        data: Buffer;
        type: string;
        mimeType: string;
    };

    export interface ResponseData {
        mediaId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
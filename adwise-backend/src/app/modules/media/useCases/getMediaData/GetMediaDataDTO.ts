import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace GetMediaDataDTO {
    export interface Request {
        mediaId: string;  
    };

    export interface ResponseData {
        data: Buffer;
        mimeType: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
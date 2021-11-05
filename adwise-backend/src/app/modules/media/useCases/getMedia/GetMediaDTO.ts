import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IMedia } from "../../models/Media";

export namespace GetMediaDTO {
    export interface Request {
        mediaId: string;
    };

    export interface ResponseData {
        media: IMedia;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
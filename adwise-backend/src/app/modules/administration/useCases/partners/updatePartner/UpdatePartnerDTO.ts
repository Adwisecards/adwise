import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace UpdatePartnerDTO {
    export interface Request {
        partnerId: string;
        index: number;
        name: string;
        description: string;
        pictureMediaId: string;
        presentationUrl: string;
    };

    export interface ResponseData {
        partnerId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
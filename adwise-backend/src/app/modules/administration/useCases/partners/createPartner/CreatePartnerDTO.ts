import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreatePartnerDTO {
    export interface Request {
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
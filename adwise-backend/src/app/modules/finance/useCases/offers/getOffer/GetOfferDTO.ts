import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOffer } from "../../../models/Offer";

export namespace GetOfferDTO {
    export interface Request {
        offerId: string;
    };

    export interface ResponseData {
        offer: IOffer;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
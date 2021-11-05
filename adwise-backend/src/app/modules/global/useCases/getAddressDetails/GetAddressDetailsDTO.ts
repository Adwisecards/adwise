import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IAddressDetails } from "../../../../services/mapsService/IMapsService";

export namespace GetAddressDetailsDTO {
    export interface Request {
        placeId: string;
        language?: string;
    };

    export interface ResponseData {
        addressDetails: IAddressDetails;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
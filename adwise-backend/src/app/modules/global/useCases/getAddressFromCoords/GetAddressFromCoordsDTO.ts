import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IAddress } from "../../../../services/mapsService/IMapsService";

export namespace GetAddressFromCoordsDTO {
    export interface Request {
        lat: number;
        long: number;
        language?: string;
    };

    export interface ResponseData {
        address: IAddress;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
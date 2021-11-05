import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IAddress } from "../../../models/Address";

export namespace CreateAddressFromCoordsDTO {
    export interface Request {
        lat: number;
        long: number;
        details?: string;
        language?: string;
    };

    export interface ResponseData {
        address: IAddress
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
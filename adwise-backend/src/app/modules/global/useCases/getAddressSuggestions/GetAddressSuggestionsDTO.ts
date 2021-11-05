import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { IAddress } from "../../../../services/mapsService/IMapsService";

export namespace GetAddressSuggestionsDTO {
    export interface Request {
        input: string;
        language?: string;
    };

    export interface ResponseData {
        addressSuggestions: IAddress[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
import { Result } from "../../../../../core/models/Result";

export interface IAddressValidationService {
    createAddressFromCoordsData<T>(data: T): Result<string | null, string | null>;
    addressDetailsData<T>(data: T): Result<string | null, string | null>;
};
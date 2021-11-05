import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DisableProductDTO {
    export interface Request {
        productId: string;
        disabled: boolean;
    };

    export interface ResponseData {
        productId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IProduct } from "../../../models/Product";

export namespace GetProductDTO {
    export interface Request {
        productId: string;
    };

    export interface ResponseData {
        product: IProduct;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
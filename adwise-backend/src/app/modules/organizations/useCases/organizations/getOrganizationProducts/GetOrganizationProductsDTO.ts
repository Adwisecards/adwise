import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IProduct } from "../../../models/Product";

export namespace GetOrganizationProductsDTO {
    export interface Request {
        limit: number;
        page: number;
        organizationId: string;
        type: string;
    };

    export interface ResponseData {
        products: IProduct[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;    
};
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace CreateProductDTO {
    export interface Request {
        name: string;
        description: string;
        picture?: string;
        pictureFile: {
            filename: string;
            data: Buffer;
        };
        code: string;
        type: string;
        organizationId: string;
        disabled: boolean;
        price: number;
    };

    export interface ResponseData {
        productId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace BindWalletsDTO {
    export interface Request {

    };

    export interface ResponseData {
        walletIds: string[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
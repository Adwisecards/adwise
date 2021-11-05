import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IRequest } from "../../../models/Request";

export namespace GetRequestDTO {
    export interface Request {
        requestId: string;
    };

    export interface ResponseData {
        request: IRequest;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
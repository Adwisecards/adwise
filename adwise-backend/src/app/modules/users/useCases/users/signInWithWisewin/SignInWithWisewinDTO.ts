import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SignInWithWisewinDTO {
    export interface Request {
        authToken: string;
        ipAddress: string;
        wisewinId: string;
    };

    export interface ResponseData {
        jwt: string;
        userId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
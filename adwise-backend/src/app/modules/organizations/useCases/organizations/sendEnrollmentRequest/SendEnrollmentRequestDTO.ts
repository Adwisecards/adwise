import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace SendEnrollmentRequestDTO {
    export interface Request {
        files: {
            filename: string;
            data: Buffer;
        }[];
        comment: string;
        managerNeeded: boolean;
        userId: string;
        packetId: string;
        email: string;
    };

    export interface ResponseData {
        success: boolean;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
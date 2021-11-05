import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace DeleteTaskDTO {
    export interface Request {
        taskId: string;
    };

    export interface ResponseData {
        taskId: string;
    };

    export type Response = Result<DeleteTaskDTO.ResponseData | null, UseCaseError | null>;
};
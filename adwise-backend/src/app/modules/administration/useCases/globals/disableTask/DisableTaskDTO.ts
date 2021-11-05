import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace DisableTaskDTO {
    export interface Request {
        taskId: string;
        disabled: boolean;
    };

    export interface ResponseData {
        taskId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
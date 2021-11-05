import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";

export namespace AddTaskDTO {
    export interface Request {
        name: string;
        points: number;
        description: string;
        disabled: boolean;
    };

    export interface ResponseData {
        taskId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
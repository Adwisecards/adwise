import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { ITask } from "../../models/Task";

export namespace GetTaskDTO {
    export interface Request {
        taskId: string;
    };

    export interface ResponseData {
        task: ITask;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
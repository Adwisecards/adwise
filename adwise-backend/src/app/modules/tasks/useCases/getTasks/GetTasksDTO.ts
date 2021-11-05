import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { ITask } from "../../models/Task";

export namespace GetTasksDTO {
    export interface Request {
        contactId: string;
    };

    export interface ResponseData {
        tasks: ITask[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
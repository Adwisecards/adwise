import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";

export namespace CreateTaskDTO {
    export interface Request {
        name: string;
        description: string;
        date: string,
        time: string;
        contactId?: string;
        participants: string[];
    };

    export interface ResponseData {
        taskId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
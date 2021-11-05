import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotification } from "../../../../notification/models/Notification";

export namespace FindAllNotificationsDTO {
    export interface Request {
        [key: string]: string | number | boolean;
        sortBy: string;
        order: number;
        pageSize: number;
        pageNumber: number;
    };

    export interface ResponseData {
        notifications: INotification[];
        count: number;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
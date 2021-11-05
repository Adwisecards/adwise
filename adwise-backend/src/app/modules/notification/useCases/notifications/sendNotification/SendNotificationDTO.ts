import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { App, NotificationType } from "../../../../../services/notificationService/INotificationService";

export namespace SendNotificationDTO {
    export interface Request {
        app?: App;
        type: NotificationType;
        title?: string;
        body?: string;
        data?: {[key: string]: any};
        values?: {[key: string]: any};
        receiverGroupId?: string;
        receiverIds?: string[];
        userId?: string;
        asOrganization?: boolean; 
    };

    export interface ResponseData {
        notificationId: string;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
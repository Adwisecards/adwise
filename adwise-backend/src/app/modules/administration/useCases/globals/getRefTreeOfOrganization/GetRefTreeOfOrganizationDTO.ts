import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscription } from "../../../../finance/models/Subscription";
import { IUser } from "../../../../users/models/User";

export namespace GetRefTreeOfOrganizationDTO {
    export interface ITreeNode {
        subscriber: IUser;
        children: ITreeNode[];
        level: number;
        root: ITreeNode;
        parent: ITreeNode;
    };
    
    export interface Request {
        organizationId: string;
    };

    export interface ResponseData {
        tree: ITreeNode[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
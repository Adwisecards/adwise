import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserTreeNode } from "../../../models/UserTreeNode";

export namespace GetUserTreeDTO {
    export interface Request {
        userId: string;
    };

    export interface ResponseData {
        userTree: IUserTreeNode;
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
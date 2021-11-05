import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserDocument } from "../../../models/UserDocument";

export namespace GetUserDocumentsDTO {
    export interface Request {
        userId: string;
        type: string;
    };

    export interface ResponseData {
        userDocuments: IUserDocument[];
    };

    export type Response = Result<ResponseData | null, UseCaseError | null>;
};
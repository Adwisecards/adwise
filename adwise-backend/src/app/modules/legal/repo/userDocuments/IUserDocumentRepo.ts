import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IUserDocument } from "../../models/UserDocument";

export interface IUserDocumentRepo extends IRepo<IUserDocument> {
    findByUserAndType(userId: string, type: string): RepoResult<IUserDocument>;
    findManyByUserAndType(userId: string, type?: string): RepoResult<IUserDocument[]>;
};
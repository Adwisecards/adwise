import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IDocument } from "../../models/Document";

export interface IDocumentRepo extends IRepo<IDocument> {
    findManyByType(type: string): RepoResult<IDocument[]>;
};
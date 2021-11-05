import { IRepo, RepoResult } from "../../../core/models/interfaces/IRepo";
import { IRef } from "../models/Ref";

export interface IRefRepo extends IRepo<IRef> {
    findByCode(code: string): RepoResult<IRef>;
    findLast(): RepoResult<IRef>;
}
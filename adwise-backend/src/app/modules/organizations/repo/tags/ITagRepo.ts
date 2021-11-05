import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { ITag } from "../../models/Tag";

export interface ITagRepo extends IRepo<ITag> {
    saveNew(tagNames: string[]): RepoResult<ITag[]>;
    findByName(name: string): RepoResult<ITag>;
};
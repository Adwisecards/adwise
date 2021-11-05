import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IGlobal } from "../../models/Global";

export interface IGlobalRepo extends IRepo<IGlobal> {
    getGlobal(): RepoResult<IGlobal>;
};
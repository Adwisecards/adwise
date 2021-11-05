import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IVersion } from "../../models/Version";

export interface IVersionRepo extends IRepo<IVersion> {
    findByType(type: string): RepoResult<IVersion[]>;
};
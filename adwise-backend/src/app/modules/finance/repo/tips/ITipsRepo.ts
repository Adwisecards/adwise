import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { ITips } from "../../models/Tips";

export interface ITipsRepo extends IRepo<ITips> {
    findManyTipsByTo(to: string, limit: number, page: number, all: boolean): RepoResult<ITips[]>;
};
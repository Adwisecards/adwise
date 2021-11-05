import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { ICategory } from "../../models/Category";

export interface ICategoryRepo extends IRepo<ICategory> {
    findByName(name: string): RepoResult<ICategory>;
};
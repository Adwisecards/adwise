import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { IProduct } from "../../models/Product";

export interface IProductRepo extends IRepo<IProduct> {
    findByOrganization(organizationId: string, type: string, limit: number, page: number): RepoResult<IProduct[]>;
};
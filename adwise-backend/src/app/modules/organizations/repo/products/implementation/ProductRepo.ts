import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { IProduct, IProductModel } from "../../../models/Product";
import { IProductRepo } from "../IProductRepo";

export class ProductRepo extends Repo<IProduct, IProductModel> implements IProductRepo {
    public async findByOrganization(organizationId: string, type: string, limit: number, page: number) {
        try {
            const query = {
                organization: organizationId,
            };

            if (type) {
                (<any>query).type = type;
            }

            const products = await this.Model.find(query)
                .limit(limit)
                .skip(limit * (page - 1));
            
            return Result.ok(products);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ICouponCategory, ICouponCategoryModel } from "../../../models/CouponCategory";
import { ICouponCategoryRepo } from "../ICouponCategoryRepo";

export class CouponCategoryRepo extends Repo<ICouponCategory, ICouponCategoryModel> implements ICouponCategoryRepo {
    public async findByNameAndOrganization(name: string, organizationId: string) {
        try {
            const couponCategory = await this.Model.findOne({name: name.toLowerCase(), organization: organizationId});
            if (!couponCategory) {
                return Result.fail(new RepoError('Coupon category does not exist', 404));
            }

            return Result.ok(couponCategory);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findManyByOrganizationAndDisabled(organizationId: string, disabled?: boolean) {
        try {
            const query: Record<string, any> = {organization: organizationId};
            
            if (disabled != undefined) {
                query.disabled = disabled;
            }

            const couponCategories = await this.Model.find(query);

            return Result.ok(couponCategories);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
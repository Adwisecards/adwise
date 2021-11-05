import { IRepo, RepoResult } from "../../../../core/models/interfaces/IRepo";
import { ICouponCategory } from "../../models/CouponCategory";

export interface ICouponCategoryRepo extends IRepo<ICouponCategory> {
    findByNameAndOrganization(name: string, organizationId: string): RepoResult<ICouponCategory>;
    findManyByOrganizationAndDisabled(organizationId: string, disabled?: boolean): RepoResult<ICouponCategory[]>;
};
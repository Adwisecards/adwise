import { CouponCategoryModel } from "../../models/CouponCategory";
import { CouponCategoryRepo } from "./implementation/CouponCategoryRepo";

export const couponCategoryRepo = new CouponCategoryRepo(CouponCategoryModel);
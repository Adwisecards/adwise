import { couponCategoryRepo } from "../../../../app/modules/organizations/repo/couponCategories";
import { createCouponCategoryUseCase } from "../../../../app/modules/organizations/useCases/couponCategories/createCouponCategory";
import { CreateCouponCategoryTest } from "./CreateCouponCategoryTest";

export const createCouponCategoryTest = new CreateCouponCategoryTest(
    couponCategoryRepo,
    createCouponCategoryUseCase
);
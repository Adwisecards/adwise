import { couponCategoryRepo } from "../../../repo/couponCategories";
import { couponCategoryValidationService } from "../../../services/couponCategories/couponCategoryValidationService";
import { GetOrganizationCouponCategoriesController } from "./GetOrganizationCouponCategoriesController";
import { GetOrganizationCouponCategoriesUseCase } from "./GetOrganizationCouponCategoriesUseCase";

export const getOrganizationCouponCategoriesUseCase = new GetOrganizationCouponCategoriesUseCase(
    couponCategoryRepo,
    couponCategoryValidationService
);

export const getOrganizationCouponCategoriesController = new GetOrganizationCouponCategoriesController(getOrganizationCouponCategoriesUseCase);
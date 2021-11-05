import { userRepo } from "../../../../users/repo/users";
import { couponCategoryRepo } from "../../../repo/couponCategories";
import { couponRepo } from "../../../repo/coupons";
import { couponValidationService } from "../../../services/coupons/couponValidationService";
import { SetCouponCategoriesController } from "./SetCouponCategoriesController";
import { SetCouponCategoriesUseCase } from "./SetCouponCategoriesUseCase";

export const setCouponCategoriesUseCase = new SetCouponCategoriesUseCase(
    userRepo,
    couponRepo,
    couponCategoryRepo,
    couponValidationService
);

export const setCouponCategoriesController = new SetCouponCategoriesController(setCouponCategoriesUseCase);
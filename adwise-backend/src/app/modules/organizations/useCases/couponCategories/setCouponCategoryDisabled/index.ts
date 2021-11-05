import { userRepo } from "../../../../users/repo/users";
import { couponCategoryRepo } from "../../../repo/couponCategories";
import { couponCategoryValidationService } from "../../../services/couponCategories/couponCategoryValidationService";
import { SetCouponCategoryDisabledController } from "./SetCouponCategoryDisabledController";
import { SetCouponCategoryDisabledUseCase } from "./SetCouponCategoryDisabledUseCase";

export const setCouponCategoryDisabledUseCase = new SetCouponCategoryDisabledUseCase(
    userRepo,
    couponCategoryRepo,
    couponCategoryValidationService
);

export const setCouponCategoryDisabledController = new SetCouponCategoryDisabledController(setCouponCategoryDisabledUseCase);
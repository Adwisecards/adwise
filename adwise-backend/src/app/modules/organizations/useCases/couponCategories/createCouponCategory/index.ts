import { userRepo } from "../../../../users/repo/users";
import { couponCategoryRepo } from "../../../repo/couponCategories";
import { organizationRepo } from "../../../repo/organizations";
import { couponCategoryValidationService } from "../../../services/couponCategories/couponCategoryValidationService";
import { CreateCouponCategoryController } from "./CreateCouponCategoryController";
import { CreateCouponCategoryUseCase } from "./CreateCouponCategoryUseCase";

export const createCouponCategoryUseCase = new CreateCouponCategoryUseCase(
    userRepo,
    organizationRepo,
    couponCategoryRepo,
    couponCategoryValidationService
);

export const createCouponCategoryController = new CreateCouponCategoryController(
    createCouponCategoryUseCase
);
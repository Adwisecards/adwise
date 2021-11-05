import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createCouponCategoryController } from "../../../useCases/couponCategories/createCouponCategory";
import { getOrganizationCouponCategoriesController } from "../../../useCases/couponCategories/getOrganizationCouponCategories";
import { setCouponCategoryDisabledController } from "../../../useCases/couponCategories/setCouponCategoryDisabled";

export const couponCategoryRouter = Router();

couponCategoryRouter.post('/create-coupon-category', applyBlock, applyAuth, (req, res) => createCouponCategoryController.execute(req, res));
couponCategoryRouter.get('/get-organization-coupon-categories/:id', applyBlock, (req, res) => getOrganizationCouponCategoriesController.execute(req, res));
couponCategoryRouter.put('/set-coupon-category-disabled/:id', applyBlock, applyAuth, (req, res) => setCouponCategoryDisabledController.execute(req, res));

/*
[
    {   
        "name": "create coupon category",
        "path": "/organizations/create-coupon-category",
        "dto": "src/app/modules/organizations/useCases/couponCategories/createCouponCategory/CreateCouponCategoryDTO.ts",
        "errors": "src/app/modules/organizations/useCases/couponCategories/createCouponCategory/createCouponCategoryErrors.ts",
        "method": "POST",
        "description": "Создаёт категорию купона."
    },
    {   
        "name": "get organization coupon categories",
        "path": "/organizations/get-organization-coupon-categories/{organizationId}?disabled={1 | 0}",
        "dto": "src/app/modules/organizations/useCases/couponCategories/getOrganizationCouponCategories/GetOrganizationCouponCategoriesDTO.ts",
        "errors": "src/app/modules/organizations/useCases/couponCategories/getOrganizationCouponCategories/getOrganizationCouponCategoriesErrors.ts",
        "method": "GET",
        "description": "Возвращает категории купонов организации."
    },
    {   
        "name": "set coupon category disabled",
        "path": "/organizations/set-coupon-category-disabled/{couponCategoryId}",
        "dto": "src/app/modules/organizations/useCases/couponCategories/setCouponCategoryDisabled/SetCouponCategoryDisabledDTO.ts",
        "errors": "src/app/modules/organizations/useCases/couponCategories/setCouponCategoryDisabled/setCouponCategoryDisabledErrors.ts",
        "method": "PUT",
        "description": "Отключает/включает категорию купона."
    }
]
*/
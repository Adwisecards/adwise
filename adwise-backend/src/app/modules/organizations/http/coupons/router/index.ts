import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { addCouponToContactController } from "../../../useCases/coupons/addCouponToContact";
import { createCouponController } from "../../../useCases/coupons/createCoupon";
import { deleteCouponController } from "../../../useCases/coupons/deleteCoupon";
import { deleteCouponFromContactController } from "../../../useCases/coupons/deleteCouponFromContact";
import { findCouponsController } from "../../../useCases/coupons/findCoupons";
import { getCategoryCouponsController } from "../../../useCases/coupons/getCategoryCoupons";
import { getCouponController } from "../../../useCases/coupons/getCoupon";
import { getCouponsByCategoryController } from "../../../useCases/coupons/getCouponsByCategory";
import { setCouponDisabledController } from "../../../useCases/coupons/setCouponDisabled";
import '../../../useCases/coupons/checkCoupon';
import '../../../useCases/coupons/updateCouponStatistics';
import { getUserCouponsController } from "../../../useCases/coupons/getUserCoupons";
import { setCouponIndecesController } from "../../../useCases/coupons/setCouponIndeces";
import { setCouponCategoriesController } from "../../../useCases/coupons/setCouponCategories";

const couponRouter = Router();

couponRouter.post('/create-coupon', applyBlock, applyAuth, (req, res) => createCouponController.execute(req, res));
couponRouter.delete('/delete-coupon/:id', applyBlock, applyAuth, (req, res) => deleteCouponController.execute(req, res));
couponRouter.get('/get-coupon/:id', applyBlock, (req, res) => getCouponController.execute(req, res));
couponRouter.get('/get-category-coupons/:id', applyBlock, applyAuth, (req, res) => getCategoryCouponsController.execute(req, res));
couponRouter.put('/add-coupon-to-contact/:id', applyBlock, applyAuth, (req, res) => addCouponToContactController.execute(req, res));
couponRouter.put('/delete-coupon-from-contact/:id', applyBlock, applyAuth, (req, res) => deleteCouponFromContactController.execute(req, res));
couponRouter.get('/get-coupons-by-category/:id', applyBlock, applyAuth, (req, res) => getCouponsByCategoryController.execute(req, res));
couponRouter.put('/set-coupon-disabled/:id', applyBlock, applyAuth, (req, res) => setCouponDisabledController.execute(req, res));
couponRouter.get('/find-coupons', applyBlock, applyAuth, (req, res) => findCouponsController.execute(req, res));
couponRouter.get('/get-user-coupons', applyBlock, applyAuth, (req, res) => getUserCouponsController.execute(req, res));
couponRouter.put('/set-coupon-indeces', applyBlock, applyAuth, (req, res) => setCouponIndecesController.execute(req, res));
couponRouter.put('/set-coupon-categories/:id', applyBlock, applyAuth, (req, res) => setCouponCategoriesController.execute(req, res));

export {
    couponRouter
};

/*
[
    {   
        "name": "create coupon",
        "path": "/organizations/create-coupon",
        "dto": "src/app/modules/organizations/useCases/coupons/createCoupon/CreateCouponDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/createCoupon/createCouponErrors.ts",
        "method": "POST",
        "description": "Создаёт купон и добавляет ссылку на него в объект организации.",
        "tags": ["administration"]
    },
    {   
        "name": "delete coupon",
        "path": "/organizations/delete-coupon/{id}",
        "dto": "src/app/modules/organizations/useCases/coupons/deleteCoupon/DeleteCouponDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/deleteCoupon/deleteCouponErrors.ts",
        "method": "DELETE",
        "description": "Удаляет купон.",
        "tags": ["administration"]
    },
    {   
        "name": "get coupon",
        "path": "/organizations/get-coupon/{id}",
        "dto": "src/app/modules/organizations/useCases/coupons/getCoupon/GetCouponDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/getCoupon/getCouponErrors.ts",
        "method": "GET"
    },
    {   
        "name": "get category coupons",
        "path": "/organizations/get-category-coupons/{contactId}",
        "dto": "src/app/modules/organizations/useCases/coupons/getCategoryCoupons/GetCategoryCouponsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/getCategoryCoupons/getCategoryCouponsErrors.ts",
        "method": "GET",
        "description": "Возвращает все купоны пользователя, рассортированныепо категориям."
    },
    {
        "name": "add coupon to contact",
        "path": "/organizations/add-coupon-to-contact/{couponId}",
        "dto": "src/app/modules/organizations/useCases/coupons/addCouponToContact/AddCouponToContactDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/addCouponToContact/addCouponToContactErrors.ts",
        "method": "PUT",
        "description": "Добавляет купон пользователю."
    },
    {
        "name": "delete coupon from contact",
        "path": "/organizations/delete-coupon-from-contact/{couponId}",
        "dto": "src/app/modules/organizations/useCases/coupons/deleteCouponFromContact/DeleteCouponFromContactDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/deleteCouponFromContact/deleteCouponFromContactErrors.ts",
        "method": "PUT",
        "description": "Удаляет купон пользователя."
    },
    {
        "name": "set coupon disabled",
        "path": "/organizations/set-coupon-disabled/{couponId}",
        "dto": "src/app/modules/organizations/useCases/coupons/setCouponDisabled/SetCouponDisabledDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/setCouponDisabled/setCouponDisabledErrors.ts",
        "method": "PUT",
        "description": "Установливает значение поля disabled."
    },
    {   
        "name": "get coupons by category",
        "path": "/organizations/get-coupons-by-category/{contactId}?category={category}",
        "dto": "src/app/modules/organizations/useCases/coupons/getCouponsByCategory/GetCouponsByCategoryDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/getCouponsByCategory/getCouponsByCategoryErrors.ts",
        "method": "GET",
        "description": "Возвращает все купоны пользователя по категории."
    },
    {   
        "name": "Find coupons",
        "path": "/organizations/find-coupons?limit={limit}&page={page}&search={search}",
        "dto": "src/app/modules/organizations/useCases/coupons/findCoupons/FindCouponsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/findCoupons/findCouponsErrors.ts",
        "method": "GET",
        "description": "Находит купоны пользователя."
    },
    {   
        "name": "Get user coupons",
        "path": "/organizations/get-user-coupons",
        "dto": "src/app/modules/organizations/useCases/coupons/getUserCoupons/GetUserCouponsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/getUserCoupons/getUserCouponsErrors.ts",
        "method": "GET",
        "description": "Находит купоны пользователя."
    },
    {
        "name": "Set coupon indeces",
        "path": "/organizations/set-coupon-indeces",
        "dto": "src/app/modules/organizations/useCases/coupons/setCouponIndeces/SetCouponIndecesDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/setCouponIndeces/setCouponIndecesErrors.ts",
        "method": "PUT",
        "description": "Устанавливает индексы купонов."
    },
    {
        "name": "Set coupon category",
        "path": "/organizations/set-coupon-category/{couponId}",
        "dto": "src/app/modules/organizations/useCases/coupons/setCouponCategory/SetCouponCategoryDTO.ts",
        "errors": "src/app/modules/organizations/useCases/coupons/setCouponCategory/setCouponCategoryErrors.ts",
        "method": "PUT",
        "description": "Устанавливает категорию купона."
    }
]
*/
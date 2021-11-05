import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { addCouponToUserHiddenListController } from "../../../useCases/hiddenCouponLists/addCouponToUserHiddenList";
import { getUserHiddenCouponsController } from "../../../useCases/hiddenCouponLists/getUserHiddenCoupons";
import { removeCouponFromUserHiddenListController } from "../../../useCases/hiddenCouponLists/removeCouponFromUserHiddenList";

export const hiddenCouponListRouter = Router();

hiddenCouponListRouter.get('/get-user-hidden-coupons', applyBlock, applyAuth, (req, res) => getUserHiddenCouponsController.execute(req, res));
hiddenCouponListRouter.put('/add-coupon-to-user-hidden-list', applyBlock, applyAuth, (req, res) => addCouponToUserHiddenListController.execute(req, res));
hiddenCouponListRouter.put('/remove-coupon-from-user-hidden-list', applyBlock, applyAuth, (req, res) => removeCouponFromUserHiddenListController.execute(req, res));

/*
[
    {   
        "name": "get user hidden coupons",
        "path": "/organizations/get-user-hidden-coupons",
        "dto": "src/app/modules/organizations/useCases/hiddenCouponLists/getUserHiddenCoupons/GetUserHiddenCouponsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/hiddenCouponLists/getUserHiddenCoupons/getUserHiddenCouponsErrors.ts",
        "method": "GET",
        "description": "Возвращает лист скрытых купонов пользователя."
    },
    {   
        "name": "add coupon to user hidden list",
        "path": "/organizations/add-coupon-to-user-hidden-list",
        "dto": "src/app/modules/organizations/useCases/hiddenCouponLists/addCouponToUserHiddenList/AddCouponToUserHiddenListDTO.ts",
        "errors": "src/app/modules/organizations/useCases/hiddenCouponLists/addCouponToUserHiddenList/addCouponToUserHiddenListErrors.ts",
        "method": "PUT",
        "description": "Добавляет купон в лист скрытых купонов пользователя."
    },
    {   
        "name": "remove coupon from user hidden list",
        "path": "/organizations/remove-coupon-from-user-hidden-list",
        "dto": "src/app/modules/organizations/useCases/hiddenCouponLists/removeCouponFromUserHiddenList/RemoveCouponFromUserHiddenListDTO.ts",
        "errors": "src/app/modules/organizations/useCases/hiddenCouponLists/removeCouponFromUserHiddenList/removeCouponFromUserHiddenListErrors.ts",
        "method": "PUT",
        "description": "Убирает купон из листа скрытых купонов пользователя."
    }
]
*/
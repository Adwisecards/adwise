import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { addCouponToUserFavoriteListController } from "../../../useCases/favoriteCouponLists/addCouponToUserFavoriteList";
import { getUserFavoriteCouponsController } from "../../../useCases/favoriteCouponLists/getUserFavoriteCoupons";
import { removeCouponFromuserFavoriteListController } from "../../../useCases/favoriteCouponLists/removeCouponFromUserFavoriteList";

export const favoriteCouponListRouter = Router();

favoriteCouponListRouter.get('/get-user-favorite-coupons', applyBlock, applyAuth, (req, res) => getUserFavoriteCouponsController.execute(req, res));
favoriteCouponListRouter.put('/add-coupon-to-user-favorite-list', applyBlock, applyAuth, (req, res) => addCouponToUserFavoriteListController.execute(req, res));
favoriteCouponListRouter.put('/remove-coupon-from-user-favorite-list', applyBlock, applyAuth, (req, res) => removeCouponFromuserFavoriteListController.execute(req, res));

/*
[
    {   
        "name": "get user favorite coupons",
        "path": "/organizations/get-user-favorite-coupons",
        "dto": "src/app/modules/organizations/useCases/favoriteCouponLists/getUserFavoriteCoupons/GetUserFavoriteCouponsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/favoriteCouponLists/getUserFavoriteCoupons/getUserFavoriteCouponsErrors.ts",
        "method": "GET",
        "description": "Возвращает лист избранных купонов пользователя."
    },
    {   
        "name": "add coupon to user favorite list",
        "path": "/organizations/add-coupon-to-user-favorite-list",
        "dto": "src/app/modules/organizations/useCases/favoriteCouponLists/addCouponToUserFavoriteList/AddCouponToUserFavoriteListDTO.ts",
        "errors": "src/app/modules/organizations/useCases/favoriteCouponLists/addCouponToUserFavoriteList/addCouponToUserFavoriteListErrors.ts",
        "method": "PUT",
        "description": "Добавляет купон в лист избранных купонов пользователя."
    },
    {   
        "name": "remove coupon from user favorite list",
        "path": "/organizations/remove-coupon-from-user-favorite-list",
        "dto": "src/app/modules/organizations/useCases/favoriteCouponLists/removeCouponFromUserFavoriteList/RemoveCouponFromUserFavoriteListDTO.ts",
        "errors": "src/app/modules/organizations/useCases/favoriteCouponLists/removeCouponFromUserFavoriteList/removeCouponFromUserFavoriteListErrors.ts",
        "method": "PUT",
        "description": "Убирает купон из листа избранных купонов пользователя."
    }
]
*/
import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { changeSubscriptionParentController } from "../../../useCases/subscriptions/changeSubscriptionParent";
import { getFirstLevelSubscriptionController } from "../../../useCases/subscriptions/getFirstLevelSubscriptions";
import { getLevelSubscriptionsController } from "../../../useCases/subscriptions/getLevelSubscriptions";
import { getOtherLevelSubscriptionsController } from "../../../useCases/subscriptions/getOtherLevelSubscriptions";

const subscriptionRouter = Router();

subscriptionRouter.get('/get-first-level-subscriptions', applyBlock, applyAuth, (req, res) => getFirstLevelSubscriptionController.execute(req, res));
subscriptionRouter.get('/get-other-level-subscriptions', applyBlock, applyAuth, (req, res) => getOtherLevelSubscriptionsController.execute(req, res));
subscriptionRouter.get('/get-level-subscriptions/:id', applyBlock, applyAuth, (req, res) => getLevelSubscriptionsController.execute(req, res));
subscriptionRouter.put('/change-subscription-parent/:id', applyBlock, applyAuth, (req, res) => changeSubscriptionParentController.execute(req, res));

export {
    subscriptionRouter
};

/*
[
    {   
        "name": "get first level subscriptions",
        "path": "/finance/get-first-level-subscriptions",
        "dto": "src/app/modules/finance/useCases/subscriptions/getFirstLevelSubscriptions/GetFirstLevelSubscriptionsDTO.ts",
        "errors": "src/app/modules/finance/useCases/subscriptions/getFirstLevelSubscriptions/getFirstLevelSubscriptionsErrors.ts",
        "method": "GET",
        "description": "Возвращает подписки первого уровня."
    },
    {   
        "name": "get level refs",
        "path": "/finance/get-level-subscriptions/{organizationId}?level={level}",
        "dto": "src/app/modules/finance/useCases/subscriptions/getLevelSubscriptions/GetLevelSubscriptionsDTO.ts",
        "errors": "src/app/modules/finance/useCases/subscriptions/getLevelSubscriptions/getLevelSubscriptionsErrors.ts",
        "method": "GET",
        "description": "Возвращает рефералов конкретного уровня."
    },
    {   
        "name": "get other level subscriptions",
        "path": "/finance/get-other-level-subscriptions",
        "dto": "src/app/modules/finance/useCases/subscriptions/getOtherLevelSubscriptions/GetOtherLevelSubscriptionsDTO.ts",
        "errors": "src/app/modules/finance/useCases/subscriptions/getOtherLevelSubscriptions/getOtherLevelSubscriptionsErrors.ts",
        "method": "GET",
        "description": "Возвращает подписки всех уровней, кроме первого."
    }
]
*/
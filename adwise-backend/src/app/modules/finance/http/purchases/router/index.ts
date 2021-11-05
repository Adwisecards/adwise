import { Router } from "express";
import { applyAdminGuest, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { completePurchaseController } from "../../../useCases/purchases/completePurchase";
import { confirmPurchaseController } from "../../../useCases/purchases/confirmPurchase";
import { createPurchaseController } from "../../../useCases/purchases/createPurchase";
import { createPurchaseAsUserController } from "../../../useCases/purchases/createPurchaseAsUser";
import { getPurchaseController } from "../../../useCases/purchases/getPurchase";
import { getUserPurchasesController } from "../../../useCases/purchases/getUserPurchases";
import { payPurchaseController } from "../../../useCases/purchases/payPurchase";
import '../../../useCases/purchases/changePurchaseStatuses';
import { payPurchaseWithCashController } from "../../../useCases/purchases/payPurchaseWithCash";
import { addCommentToPurchaseController } from "../../../useCases/purchases/addCommentToPurchase";
import { addReviewToPurchaseController } from "../../../useCases/purchases/addReviewToPurchase";
import { getCashierPurchaseStatisticsController } from "../../../useCases/purchases/getCashierPurchaseStatistics";
import { cancelPurchaseController } from "../../../useCases/purchases/cancelPurchase";
import { createPurchaseForClientsController } from "../../../useCases/purchases/createPurchaseForClients";
import { sharePurchaseController } from "../../../useCases/purchases/sharePurchase";
import { setPurchasePaidController } from "../../../useCases/purchases/setPurchasePaid";
import { setPurchaseArchivedController } from "../../../useCases/purchases/setPurchaseArchived";

const purchaseRouter = Router();

purchaseRouter.post('/create-purchase', applyBlock, applyAuth, (req, res) => createPurchaseController.execute(req, res));
purchaseRouter.put('/confirm-purchase/:id', applyBlock, applyAuth, (req, res) => confirmPurchaseController.execute(req, res));
purchaseRouter.get('/get-purchase/:id', applyBlock, applyAuth, (req, res) => getPurchaseController.execute(req, res));
purchaseRouter.post('/pay-purchase/:id', applyBlock, applyAuth, (req, res) => payPurchaseController.execute(req, res));
purchaseRouter.get('/get-user-purchases', applyBlock, applyAuth, (req, res) => getUserPurchasesController.execute(req, res));
purchaseRouter.put('/create-purchase-as-user/:id', applyBlock, applyAuth, (req, res) => createPurchaseAsUserController.execute(req, res));
purchaseRouter.put('/complete-purchase/:id', applyBlock, applyAuth, (req, res) => completePurchaseController.execute(req, res));
purchaseRouter.post('/pay-purchase-with-cash/:id', applyBlock, applyAuth, (req, res) => payPurchaseWithCashController.execute(req, res));
purchaseRouter.put('/add-comment-to-purchase/:id', applyBlock, applyAuth, (req, res) => addCommentToPurchaseController.execute(req, res));
purchaseRouter.put('/add-review-to-purchase/:id', applyBlock, applyAuth, (req, res) => addReviewToPurchaseController.execute(req, res));
purchaseRouter.get('/get-cashier-purchase-statistics', applyBlock, applyAuth, (req, res) => getCashierPurchaseStatisticsController.execute(req, res));
purchaseRouter.put('/cancel-purchase/:id', applyBlock, applyAuth, (req, res) => cancelPurchaseController.execute(req, res));
purchaseRouter.post('/create-purchase-for-clients', applyBlock, applyAuth, (req, res) => createPurchaseForClientsController.execute(req, res));
purchaseRouter.put('/share-purchase', applyBlock, applyAuth, (req, res) => sharePurchaseController.execute(req, res));
purchaseRouter.put('/set-purchase-paid/:id', applyAdminGuest, (req, res) => setPurchasePaidController.execute(req, res));
purchaseRouter.put('/set-purchase-archived/:id', applyBlock, applyAuth, (req, res) => setPurchaseArchivedController.execute(req, res));

export {
    purchaseRouter
};

/*
[
    {   
        "name": "create purchase",
        "path": "/finance/create-purchase",
        "dto": "src/app/modules/finance/useCases/purchases/createPurchase/CreatePurchaseDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/createPurchase/createPurchaseErrors.ts",
        "method": "POST",
        "description": "Создаёт запись о покупке, вызывается из приложения <Кассир>.",
        "tags": ["cashier"]
    },
    {   
        "name": "share purchase",
        "path": "/finance/share-purchase",
        "dto": "src/app/modules/finance/useCases/purchases/sharePurchase/SharePurchaseDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/sharePurchase/sharePurchaseErrors.ts",
        "method": "PUT",
        "description": "Метод, чтобы поделиться покупкой."
    },
    {   
        "name": "create purchase for clients",
        "path": "/finance/create-purchase-for-clients",
        "dto": "src/app/modules/finance/useCases/purchases/createPurchaseForClients/CreatePurchaseForClientsDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/createPurchaseForClients/createPurchaseForClientsErrors.ts",
        "method": "POST",
        "description": "Создаёт заказы для клиентов, вызывается из СРМ."
    },
    {   
        "name": "Add comment to purchase",
        "path": "/finance/add-comment-to-purchase/{purchaseId}",
        "dto": "src/app/modules/finance/useCases/purchases/addCommentToPurchase/AddCommentToPurchaseDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/addCommentToPurchase/addCommentToPurchaseErrors.ts",
        "method": "PUT",
        "description": "Добавляет комментарий к покупке"
    },
    {   
        "name": "Add review to purchase",
        "path": "/finance/add-review-to-purchase/{purchaseId}",
        "dto": "src/app/modules/finance/useCases/purchases/addReviewToPurchase/AddReviewToPurchaseDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/addReviewToPurchase/addReviewToPurchaseErrors.ts",
        "method": "PUT",
        "description": "Добавляет отзыв к покупке"
    },
    {   
        "name": "create purchase as user",
        "path": "/finance/create-purchase-as-user",
        "dto": "src/app/modules/finance/useCases/purchases/createPurchaseAsUser/CreatePurchaseAsUserDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/createPurchaseAsUser/createPurchaseAsUserErrors.ts",
        "method": "PUT",
        "description": "Создаёт запись о покупке, вызывается из приложения <Пользователь>.",
        "tags": ["cashier"]
    },
    {   
        "name": "confirm purchase",
        "path": "/finance/confirm-purchase/{id}",
        "dto": "src/app/modules/finance/useCases/purchases/confirmPurchase/ConfirmPurchaseDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/confirmPurchase/confirmPurchaseErrors.ts",
        "method": "PUT",
        "description": "Меняет статус покупки на подтвержденный, списывает баллы у пользователя, добавляет баллы организации и распределяет баллы по реф. сетке покупателя."
    },
    {   
        "name": "pay purchase",
        "path": "/finance/pay-purchase/{id}",
        "dto": "src/app/modules/finance/useCases/purchases/payPurchase/PayPurchaseDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/payPurchase/payPurchaseErrors.ts",
        "method": "POST",
        "description": "Создаёт и возвращает объект платежа."
    },
    {   
        "name": "pay purchase with cash",
        "path": "/finance/pay-purchase-with-cash/{id}",
        "dto": "src/app/modules/finance/useCases/purchases/payPurchaseWithCash/PayPurchaseWithCashDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/payPurchaseWithCash/payPurchaseWithCashErrors.ts",
        "method": "POST",
        "description": "Создаёт и возвращает объект платежа."
    },
    {   
        "name": "get purchase",
        "path": "/finance/get-purchase/{id}",
        "dto": "src/app/modules/finance/useCases/purchases/getPurchase/GetPurchaseDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/getPurchase/getPurchaseErrors.ts",
        "method": "GET",
        "description": "Возвращает покупку."
    },
    {   
        "name": "get purchases",
        "path": "/finance/get-user-purchases?limit={limit}&page={page}",
        "dto": "src/app/modules/finance/useCases/purchases/getUserPurchases/GetUserPurchasesDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/getUserPurchases/getUserPurchasesErrors.ts",
        "method": "GET",
        "description": "Возвращает покупки пользователя."
    },
    {   
        "name": "complete purchases",
        "path": "/finance/complete-purchase/{purchaseId}",
        "dto": "src/app/modules/finance/useCases/purchases/completePurchase/CompletePurchaseDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/completePurchase/completePurchaseErrors.ts",
        "method": "PUT",
        "description": "Завершает покупку."
    },
    {   
        "name": "get cashier purchase statistics",
        "path": "/finance/get-cashier-purchase-statistics",
        "dto": "src/app/modules/finance/useCases/purchases/getCashierPurchaseStatistics/GetCashierPurchaseStatisticsDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/getCashierPurchaseStatistics/getCashierPurchaseStatisticsErrors.ts",
        "method": "GET",
        "description": "Возвращает статистику по продажам кассира."
    },
    {   
        "name": "Cancel purchase",
        "path": "/finance/cancel-purchase/{id}",
        "dto": "src/app/modules/finance/useCases/purchases/cancelPurchase/CancelPurchaseDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/cancelPurchase/cancelPurchaseErrors.ts",
        "method": "PUT",
        "description": "Отменяет заказ."
    },
    {   
        "name": "Set purchase archived",
        "path": "/finance/set-purchase-archived/{id}",
        "dto": "src/app/modules/finance/useCases/purchases/setPurchaseArchived/SetPurchaseArchivedDTO.ts",
        "errors": "src/app/modules/finance/useCases/purchases/setPurchaseArchived/setPurchaseArchivedErrors.ts",
        "method": "PUT",
        "description": "Архивирует заказ."
    }
]
*/
import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getCashierTipsController } from "../../../useCases/tips/getCashierTips";
import { getCashierTipsStatisticsController } from "../../../useCases/tips/getCashierTipsStatistics";
import { sendTipsController } from "../../../useCases/tips/sendTips";

export const tipsRouter = Router();

tipsRouter.post('/send-tips', applyBlock, (req, res) => sendTipsController.execute(req, res));
tipsRouter.get('/get-cashier-tips/:id', applyBlock, applyAuth, (req, res) => getCashierTipsController.execute(req, res));
tipsRouter.get('/get-cashier-tips-statistics/:id', applyBlock, applyAuth, (req, res) => getCashierTipsStatisticsController.execute(req, res));

/*
[
    {
        "name": "Send tips to a cashier",
        "path": "/finance/send-tips",
        "dto": "src/app/modules/finance/useCases/tips/sendTips/SendTipsDTO.ts",
        "errors": "src/app/modules/finance/useCases/tips/sendTips/sendTipsErrors.ts",
        "method": "POST",
        "description": "Создаёт и возвращает платёж для чаевых."
    },
    {
        "name": "Get cashier tips",
        "path": "/finance/get-cashier-tips/{id}?limit={limit}&page={page}",
        "dto": "src/app/modules/finance/useCases/tips/getCashierTips/GetCashierTipsDTO.ts",
        "errors": "src/app/modules/finance/useCases/tips/getCashierTips/getCashierTipsErrors.ts",
        "method": "GET",
        "description": "Возвращает чаевые пользователя."
    },
    {
        "name": "Get cashier tips statistics",
        "path": "/finance/get-cashier-tips-statistics/{id}",
        "dto": "src/app/modules/finance/useCases/tips/getCashierTipsStatistics/GetCashierTipsStatisticsDTO.ts",
        "errors": "src/app/modules/finance/useCases/tips/getCashierTipsStatistics/getCashierTipsStatisticsErrors.ts",
        "method": "GET",
        "description": "Возвращает статистику по чаевым пользователя."
    }
]
*/
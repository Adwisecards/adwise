import { create } from "domain";
import { Router } from "express";
import { applyAdmin, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createLegalWithdrawalRequestController } from "../../../useCases/withdrawalRequests/createLegalWithdrawalRequest";
import { createWithdrawalRequestController } from "../../../useCases/withdrawalRequests/createWithdrawalRequest";
import { createWithdrawalRequestTokenController } from "../../../useCases/withdrawalRequests/createWithdrawalRequestToken";
import { getWithdrawalRequestDataController } from "../../../useCases/withdrawalRequests/getWithdrawalRequestData";
import { setLegalWithdrawalRequestSatisfiedController } from "../../../useCases/withdrawalRequests/setLegalWithdrawalRequestSatisfied";
import { setWithdrawalRequestSatisfiedController } from "../../../useCases/withdrawalRequests/setWithdrawalRequestSatisfied";
import { updateWithdrawalRequestController } from "../../../useCases/withdrawalRequests/updateWithdrawalRequest";

const withdrawalRequestRouter = Router();

withdrawalRequestRouter.post('/create-withdrawal-request', applyBlock, (req, res) => createWithdrawalRequestController.execute(req, res));
withdrawalRequestRouter.get('/get-withdrawal-request-token', applyBlock, applyAuth, (req, res) => createWithdrawalRequestTokenController.execute(req, res));
withdrawalRequestRouter.get('/get-withdrawal-request-data/:token', applyBlock, (req, res) => getWithdrawalRequestDataController.execute(req, res));
withdrawalRequestRouter.put('/set-withdrawal-request-satisfied/:id', applyAdmin, (req, res) => setWithdrawalRequestSatisfiedController.execute(req, res));
withdrawalRequestRouter.post('/create-legal-withdrawal-request', applyBlock, applyAuth, (req, res) => createLegalWithdrawalRequestController.execute(req, res));
withdrawalRequestRouter.put('/set-legal-withdrawal-request-satisfied/:id', applyAdmin, (req, res) => setLegalWithdrawalRequestSatisfiedController.execute(req, res));
withdrawalRequestRouter.put('/update-withdrawal-request/:id', applyAdmin, (req, res) => updateWithdrawalRequestController.execute(req, res));

export {
    withdrawalRequestRouter
};

/*
[
    {
        "name": "create withdrawal request",
        "path": "/finance/create-withdrawal-request",
        "dto": "src/app/modules/finance/useCases/withdrawalRequests/createWithdrawalRequest/CreateWithdrawalRequestDTO.ts",
        "errors": "src/app/modules/finance/useCases/withdrawalRequests/createWithdrawalRequest/createWithdrawalRequestErrors.ts",
        "method": "POST",
        "description": "Создаёт заявку на вывод средств."
    },
    {
        "name": "update withdrawal request",
        "path": "/finance/update-withdrawal-request",
        "dto": "src/app/modules/finance/useCases/withdrawalRequests/updateWithdrawalRequest/UpdateWithdrawalRequestDTO.ts",
        "errors": "src/app/modules/finance/useCases/withdrawalRequests/updateWithdrawalRequest/updateWithdrawalRequestErrors.ts",
        "method": "PUT",
        "description": "Обновляет заявку на вывод средств."
    },
    {
        "name": "create legal withdrawal request",
        "path": "/finance/create-legal-withdrawal-request",
        "dto": "src/app/modules/finance/useCases/withdrawalRequests/createLegalWithdrawalRequest/CreateLegalWithdrawalRequestDTO.ts",
        "errors": "src/app/modules/finance/useCases/withdrawalRequests/createLegalWithdrawalRequest/createLegalWithdrawalRequestErrors.ts",
        "method": "POST",
        "description": "Создаёт легальную заявку на вывод средств."
    },
    {
        "name": "get withdrawal request token",
        "path": "/finance/get-withdrawal-request-token",
        "dto": "src/app/modules/finance/useCases/withdrawalRequests/createWithdrawalRequestToken/CreateWithdrawalRequestTokenDTO.ts",
        "errors": "src/app/modules/finance/useCases/withdrawalRequests/createWithdrawalRequestToken/createWithdrawalRequestTokenErrors.ts",
        "method": "GET",
        "description": "Создаёт токен для вывода средств."
    },
    {
        "name": "get withdrawal request data",
        "path": "/finance/get-withdrawal-request-data/{id}",
        "dto": "src/app/modules/finance/useCases/withdrawalRequests/getWithdrawalRequestData/GetWithdrawalRequestDataDTO.ts",
        "errors": "src/app/modules/finance/useCases/withdrawalRequests/getWithdrawalRequestData/getWithdrawalRequestDataErrors.ts",
        "method": "GET",
        "description": "Создаёт токен для вывода средств."
    },
    {
        "name": "set withdrawal request satisfied",
        "path": "/finance/set-withdrawal-request-satisfied/{id}",
        "dto": "src/app/modules/finance/useCases/withdrawalRequests/setWithdrawalRequestSatisfied/SetWithdrawalRequestSatisfiedDTO.ts",
        "errors": "src/app/modules/finance/useCases/withdrawalRequests/setWithdrawalRequestSatisfied/setWithdrawalRequestSatisfiedErrors.ts",
        "method": "PUT",
        "description": "Подтверждает заявку на вывод средств в крипте."
    },
    {
        "name": "set legal withdrawal request satisfied",
        "path": "/finance/set-legal-withdrawal-request-satisfied/{id}",
        "dto": "src/app/modules/finance/useCases/withdrawalRequests/setLegalWithdrawalRequestSatisfied/SetLegalWithdrawalRequestSatisfiedDTO.ts",
        "errors": "src/app/modules/finance/useCases/withdrawalRequests/setLegalWithdrawalRequestSatisfied/setLegalWithdrawalRequestSatisfiedErrors.ts",
        "method": "PUT",
        "description": "Подтверждает заявку на вывод средств."
    }
]
*/
import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { acceptRequestController } from "../../../useCases/requests/acceptRequest";
import { cancelRequestController } from "../../../useCases/requests/cancelRequest";
import { createRequestController } from "../../../useCases/requests/createRequest";
import { getRequestController } from "../../../useCases/requests/getRequest";

const requestRouter = Router();

requestRouter.post('/create-request', applyBlock, applyAuth, (req, res) => createRequestController.execute(req, res));
requestRouter.delete('/accept-request/:id', applyBlock, applyAuth, (req, res) => acceptRequestController.execute(req, res));
requestRouter.delete('/cancel-request/:id', applyBlock, applyAuth, (req, res) => cancelRequestController.execute(req, res));
requestRouter.get('/get-request/:id', applyBlock, applyAuth, (req, res) => getRequestController.execute(req, res));

export {
    requestRouter
};

/*
[
    {   
        "name": "create request",
        "path": "/contacts/create-request",
        "dto": "src/app/modules/contacts/useCases/requests/createRequest/CreateRequestDTO.ts",
        "errors": "src/app/modules/contacts/useCases/requests/createRequest/createRequestErrors.ts",
        "method": "POST",
        "description": "Создаёт запрос на обмен контактами."
    },
    {   
        "name": "accept request",
        "path": "/contacts/accept-request/{id}",
        "dto": "src/app/modules/contacts/useCases/requests/acceptRequest/AcceptRequestDTO.ts",
        "errors": "src/app/modules/contacts/useCases/requests/acceptRequest/acceptRequestErrors.ts",
        "method": "DELETE",
        "description": "Метод удаляет запрос и добавляет контакты пользователей."
    },
    {   
        "name": "cancel request",
        "path": "/contacts/cancel-request/{id}",
        "dto": "src/app/modules/contacts/useCases/requests/cancelRequest/CancelRequestDTO.ts",
        "errors": "src/app/modules/contacts/useCases/requests/cancelRequest/cancelRequestErrors.ts",
        "method": "DELETE",
        "description": "Отменяет запрос на обмен."
    },
    {   
        "name": "get request",
        "path": "/contacts/get-request/{id}",
        "dto": "src/app/modules/contacts/useCases/requests/getRequest/GetRequestDTO.ts",
        "errors": "src/app/modules/contacts/useCases/requests/getRequest/getRequestErrors.ts",
        "method": "GET"
    }
]
*/
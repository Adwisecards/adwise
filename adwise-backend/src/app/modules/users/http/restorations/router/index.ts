import { Router } from "express";
import { applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { confirmRestorationController } from "../../../useCases/restorations/confirmRestoration";
import { createRestorationController } from "../../../useCases/restorations/createRestoration";
import { sendRestorationCodeController } from "../../../useCases/restorations/sendRestorationCode";

const restorationRouter = Router();

restorationRouter.post('/create-restoration', applyBlock, (req, res) => createRestorationController.execute(req, res));
restorationRouter.put('/confirm-restoration/:id', applyBlock, (req, res) => confirmRestorationController.execute(req, res));
restorationRouter.get('/send-restoration-code/:id', applyBlock, (req, res) => sendRestorationCodeController.execute(req, res));

export {
    restorationRouter
};

/*
[
    {
        "name": "create restoration",
        "path": "/accounts/restorations/create-restoration",
        "dto": "src/app/modules/users/useCases/restorations/createRestoration/CreateRestorationDTO.ts",
        "errors": "src/app/modules/users/useCases/restorations/createRestoration/createRestorationErrors.ts",
        "method": "POST",
        "description": "Создает запись запроса о смене пароля."
    },
    {
        "name": "confirm restoration",
        "path": "/accounts/restorations/confirm-restoration/{id}",
        "dto": "src/app/modules/users/useCases/restorations/confirmRestoration/ConfirmRestorationDTO.ts",
        "errors": "src/app/modules/users/useCases/restorations/confirmRestoration/confirmRestorationErrors.ts",
        "method": "PUT",
        "description": "Подтверждает запись о смене пароля и присылает новый пароль по почте или телефону."
    },
    {
        "name": "send restoration",
        "path": "/accounts/restorations/send-restoration-code/{id}",
        "dto": "src/app/modules/users/useCases/restorations/sendRestorationCode/SendRestorationCodeDTO.ts",
        "errors": "src/app/modules/users/useCases/restorations/sendRestorationCode/sendRestorationCodeErrors.ts",
        "method": "GET",
        "description": "Отправить код повторно."
    }
]
*/
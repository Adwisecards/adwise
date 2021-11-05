import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { deleteVerificationController } from "../../../useCases/verifications/deleteVerification";
import { getVerificationController } from "../../../useCases/verifications/getVerification";
import { sendVerificationController } from "../../../useCases/verifications/sendVerification";

const verificationRouter = Router();

verificationRouter.delete('/delete-verification/:id', applyBlock, (req, res) => deleteVerificationController.execute(req, res));
verificationRouter.get('/get-verification', applyBlock, applyAuth, (req, res) => getVerificationController.execute(req, res));
verificationRouter.get('/send-verification', applyBlock, applyAuth, (req, res) => sendVerificationController.execute(req, res));

export {
    verificationRouter
};

/*
[
    {
        "name": "delete verification",
        "path": "/accounts/verifications/delete-verification/{verificationId}?code={code}",
        "dto": "src/app/modules/users/useCases/verifications/deleteVerification/DeleteVerificationDTO.ts",
        "errors": "src/app/modules/users/useCases/verifications/deleteVerification/deleteVerificationErrors.ts",
        "method": "DELETE",
        "description": "Подтверждает пользователя."
    },
    {
        "name": "get verification",
        "path": "/accounts/verifications/get-verification",
        "dto": "src/app/modules/users/useCases/verifications/getVerification/GetVerificationDTO.ts",
        "errors": "src/app/modules/users/useCases/verifications/getVerification/getVerificationErrors.ts",
        "method": "GET",
        "description": "Возвращает объект подтверждения для текущего пользователя."
    },
    {
        "name": "send verification",
        "path": "/accounts/verifications/send-verification",
        "dto": "src/app/modules/users/useCases/verifications/sendVerification/SendVerificationDTO.ts",
        "errors": "src/app/modules/users/useCases/verifications/sendVerification/sendVerificationErrors.ts",
        "method": "GET",
        "description": "Присылает смс или письмо с кодом подтверждения."
    }
]
*/

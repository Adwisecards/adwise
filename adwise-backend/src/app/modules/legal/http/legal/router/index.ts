import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { checkLegalInnController } from "../../../useCases/legal/checkLegalInn";
import { createLegalController } from "../../../useCases/legal/createLegal";
import { getOrganizationLegalController } from "../../../useCases/legal/getOrganizationLegal";
import { getOrganizationLegalsController } from "../../../useCases/legal/getOrganizationLegals";
import { updateLegalInfoController } from "../../../useCases/legal/updateLegalInfo";

export const legalRouter = Router();

legalRouter.post('/create-legal', applyBlock, applyAuth, (req, res) => createLegalController.execute(req, res));
legalRouter.get('/get-organization-legals/:id', applyBlock, applyAuth, (req, res) => getOrganizationLegalsController.execute(req, res));
legalRouter.get('/get-organization-legal/:id', applyBlock, applyAuth, (req, res) => getOrganizationLegalController.execute(req, res));
legalRouter.put('/update-legal-info', applyBlock, applyAuth, (req, res) => updateLegalInfoController.execute(req, res));
legalRouter.get('/check-legal-inn/:inn', applyBlock, (req, res) => checkLegalInnController.execute(req, res));

/*
[
    {
        "name": "create legal",
        "path": "/legal/create-legal",
        "dto": "src/app/modules/legal/useCases/legal/createLegal/CreateLegalDTO.ts",
        "errors": "src/app/modules/legal/useCases/legal/createLegal/createLegalErrors.ts",
        "method": "POST",
        "description": "Создаёт реквизиты."
    },
    {
        "name": "update legal info",
        "path": "/legal/update-legal-info",
        "dto": "src/app/modules/legal/useCases/legal/updateLegalInfo/UpdateLegalInfoDTO.ts",
        "errors": "src/app/modules/legal/useCases/legal/updateLegalInfo/updateLegalInfoErrors.ts",
        "method": "PUT",
        "description": "Обновляет реквизиты."
    },
    {
        "name": "get organization legals",
        "path": "/legal/get-organization-legals/{organizationId}",
        "dto": "src/app/modules/legal/useCases/legal/getOrganizationLegals/GetOrganizationLegalsDTO.ts",
        "errors": "src/app/modules/legal/useCases/legal/getOrganizationLegals/getOrganizationLegalsErrors.ts",
        "method": "GET",
        "description": "Возвращает реквизиты."
    },
    {
        "name": "get organization legal",
        "path": "/legal/get-organization-legal/{organizationId}",
        "dto": "src/app/modules/legal/useCases/legal/getOrganizationLegal/GetOrganizationLegalDTO.ts",
        "errors": "src/app/modules/legal/useCases/legal/getOrganizationLegal/getOrganizationLegalErrors.ts",
        "method": "GET",
        "description": "Возвращает реквизиты."
    },
    {
        "name": "check legal inn",
        "path": "/legal/check-legal-inn/{inn}",
        "dto": "src/app/modules/legal/useCases/legal/checkLegalInn/CheckLegalInnDTO.ts",
        "errors": "src/app/modules/legal/useCases/legal/checkLegalInn/checkLegalInnErrors.ts",
        "method": "GET",
        "description": "Проверяет инн на уникальность в системе."
    }
]
*/
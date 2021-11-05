import { Router } from "express";
import { applyAdmin, applyAdminGuest, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createLegalInfoRequestController } from "../../../useCases/legalInfoRequests/createLegalInfoRequest";
import { rejectLegalInfoRequestController } from "../../../useCases/legalInfoRequests/rejectLegalInfoRequest";
import { satisfyLegalInfoRequestController } from "../../../useCases/legalInfoRequests/satisfyLegalInfoRequest";

export const legalInfoRequestRouter = Router();

legalInfoRequestRouter.post('/create-legal-info-request', applyBlock, applyAuth, (req, res) => createLegalInfoRequestController.execute(req, res));
legalInfoRequestRouter.put('/satisfy-legal-info-request/:id', applyBlock, applyAdminGuest, (req, res) => satisfyLegalInfoRequestController.execute(req, res));
legalInfoRequestRouter.put('/reject-legal-info-request/:id', applyBlock, applyAdminGuest, (req, res) => rejectLegalInfoRequestController.execute(req, res));

/*
[
    {
        "name": "create legal info request",
        "path": "/organizations/create-legal-info-request",
        "dto": "src/app/modules/organizations/useCases/legalInfoRequests/createLegalInfoRequest/CreateLegalInfoRequestDTO.ts",
        "errors": "src/app/modules/organizations/useCases/legalInfoRequests/createLegalInfoRequest/createLegalInfoRequestErrors.ts",
        "method": "POST",
        "description": "Создать запрос о смене реквизитов."
    },
    {
        "name": "satisfy legal info request",
        "path": "/organizations/satisfy-legal-info-request/:id",
        "dto": "src/app/modules/organizations/useCases/legalInfoRequests/satisfyLegalInfoRequest/SatisfyLegalInfoRequestDTO.ts",
        "errors": "src/app/modules/organizations/useCases/legalInfoRequests/satisfyLegalInfoRequest/satisfyLegalInfoRequestErrors.ts",
        "method": "PUT",
        "description": "Удовлетворить запрос о смене реквизитов."
    },
    {
        "name": "reject legal info request",
        "path": "/organizations/reject-legal-info-request/:id",
        "dto": "src/app/modules/organizations/useCases/legalInfoRequests/rejectLegalInfoRequest/RejectLegalInfoRequestDTO.ts",
        "errors": "src/app/modules/organizations/useCases/legalInfoRequests/rejectLegalInfoRequest/rejectLegalInfoRequestErrors.ts",
        "method": "PUT",
        "description": "Отклонить запрос о смене реквизитов."
    }
]
*/
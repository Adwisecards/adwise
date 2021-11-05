import { Router } from "express";
import { applyAdmin, applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createReceiverGroupController } from "../../../useCases/receiverGroups/createReceiverGroup";
import { exportReceiverGroupController } from "../../../useCases/receiverGroups/exportReceiverGroup";
import { updateReceiverGroupController } from "../../../useCases/receiverGroups/updateReceiverGroup";

export const receiverGroupRouter = Router();

receiverGroupRouter.post('/create-receiver-group', applyBlock, applyAuth, (req, res) => createReceiverGroupController.execute(req, res));
receiverGroupRouter.put('/update-receiver-group/:id', applyBlock, applyAuth, (req, res) => updateReceiverGroupController.execute(req, res));
receiverGroupRouter.get('/export-receiver-group/:id', applyBlock, applyAuth, (req, res) => exportReceiverGroupController.execute(req, res));

/*
[
    {   
        "name": "create receiver group",
        "path": "/notifications/create-receiver-group",
        "dto": "src/app/modules/notification/useCases/receiverGroups/createReceiverGroup/CreateReceiverGroupDTO.ts",
        "errors": "src/app/modules/notification/useCases/receiverGroups/createReceiverGroup/createReceiverGroupErrors.ts",
        "method": "POST",
        "description": "Создаёт выборку."
    },
    {   
        "name": "update receiver group",
        "path": "/notifications/update-receiver-group/{receiverGroupId}",
        "dto": "src/app/modules/notification/useCases/receiverGroups/updateReceiverGroup/UpdateReceiverGroupDTO.ts",
        "errors": "src/app/modules/notification/useCases/receiverGroups/updateReceiverGroup/updateReceiverGroupErrors.ts",
        "method": "PUT",
        "description": "Обновляет выборку."
    },
    {   
        "name": "export receiver group",
        "path": "/notifications/export-receiver-group/{receiverGroupId}",
        "dto": "src/app/modules/notification/useCases/receiverGroups/exportReceiverGroup/ExportReceiverGroupDTO.ts",
        "errors": "src/app/modules/notification/useCases/receiverGroups/exportReceiverGroup/exportReceiverGroupErrors.ts",
        "method": "GET",
        "description": "Экспортирует выборку."
    }
]
*/
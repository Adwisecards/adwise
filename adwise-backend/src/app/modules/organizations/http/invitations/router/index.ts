import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createInvitationController } from "../../../useCases/invitations/createInvitation";
import { getUserByInvitationController } from "../../../useCases/invitations/getUserByInvitation";

const invitationRouter = Router();

invitationRouter.post('/create-invitation', applyBlock, applyAuth, (req, res) => createInvitationController.execute(req, res));
invitationRouter.get('/get-user-by-invitation/:id', applyBlock, (req, res) => getUserByInvitationController.execute(req, res));

export {
    invitationRouter
};

/*
[
    {   
        "name": "create invitation",
        "path": "/organizations/create-invitation",
        "dto": "src/app/modules/organizations/useCases/invitations/createInvitation/CreateInvitationDTO.ts",
        "errors": "src/app/modules/organizations/useCases/invitations/createInvitation/createInvitationErrors.ts",
        "method": "POST",
        "description": "Создает приглашение в организацию."
    },
    {   
        "name": "get user by invitation",
        "path": "/organizations/get-user-by-invitation/{id}",
        "dto": "src/app/modules/organizations/useCases/invitations/getUserByInvitation/GetUserByInvitationDTO.ts",
        "errors": "src/app/modules/organizations/useCases/invitations/getUserByInvitation/getUserByInvitationErrors.ts",
        "method": "GET",
        "description": "Получить пользователя по инвайту."
    }
]
*/
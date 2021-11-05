import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getUserDocumentsController } from "../../../useCases/userDocuments/getUserDocuments";

export const userDocumentRouter = Router();

userDocumentRouter.get('/get-user-documents', applyBlock, applyAuth, (req, res) => getUserDocumentsController.execute(req, res));

/*
[
    {   
        "name": "get user documents",
        "path": "/legal/get-user-documents?type?={application}",
        "dto": "src/app/modules/legal/useCases/userDocuments/getUserDocuments/GetUserDocumentsDTO.ts",
        "errors": "src/app/modules/legal/useCases/userDocuments/getUserDocuments/getUserDocumentsErrors.ts",
        "method": "GET",
        "description": "Возвращает все документы пользователь."
    }
]
*/
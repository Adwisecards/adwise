import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { generateOrganizationDocumentController } from "../../../useCases/organizationDocuments/generateOrganizationDocument";
import { getOrganizationDocumentController } from "../../../useCases/organizationDocuments/getOrganizationDocument";
import { getOrganizationDocumentsController } from "../../../useCases/organizationDocuments/getOrganizationDocuments";
import '../../../useCases/organizationDocuments/updateOrganizationWithdrawalActDocument';

export const organizationDocumentRouter = Router();

organizationDocumentRouter.get('/get-organization-documents/:id', applyBlock, (req, res) => getOrganizationDocumentsController.execute(req, res));
organizationDocumentRouter.get('/get-organization-document/:id', applyBlock, (req, res) => getOrganizationDocumentController.execute(req, res));
organizationDocumentRouter.post('/generate-organization-document', applyBlock, applyAuth, (req, res) => generateOrganizationDocumentController.execute(req, res));

/*
[
    {   
        "name": "get organization documents",
        "path": "/legal/get-organization-documents/{organizationId}",
        "dto": "src/app/modules/legal/useCases/organizationDocuments/getOrganizationDocuments/GetOrganizationDocumentsDTO.ts",
        "errors": "src/app/modules/legal/useCases/organizationDocuments/getOrganizationDocuments/getOrganizationDocumentsErrors.ts",
        "method": "GET",
        "description": "Возвращает все документы организации."
    },
    {   
        "name": "get organization document",
        "path": "/legal/get-organization-document/{organizationDocumentId}",
        "dto": "src/app/modules/legal/useCases/organizationDocuments/getOrganizationDocument/GetOrganizationDocumentDTO.ts",
        "errors": "src/app/modules/legal/useCases/organizationDocuments/getOrganizationDocument/getOrganizationDocumentErrors.ts",
        "method": "GET",
        "description": "Возвращает документ организации."
    },
    {   
        "name": "generate organization document",
        "path": "/legal/generate-organization-document",
        "dto": "src/app/modules/legal/useCases/organizationDocuments/generateOrganizationDocument/GenerateOrganizationDocumentDTO.ts",
        "errors": "src/app/modules/legal/useCases/organizationDocuments/generateOrganizationDocument/generateOrganizationDocumentErrors.ts",
        "method": "POST",
        "description": "Генерирует документ организации."
    }
]
*/
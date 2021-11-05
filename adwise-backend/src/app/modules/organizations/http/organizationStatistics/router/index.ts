import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { getOrganizationStatisticsController } from "../../../useCases/organizationStatistics/getOrganizationStatistics";

export const organizationStatisticsRouter = Router();

organizationStatisticsRouter.get('/get-organization-statistics/:id', applyBlock, applyAuth, (req, res) => getOrganizationStatisticsController.execute(req, res));

/*
[
    {   
        "name": "get organization statistics",
        "path": "/organizations/get-organization-statistics/{organizationId}",
        "dto": "src/app/modules/organizations/useCases/organizationStatistics/getOrganizationStatistics/GetOrganizationStatisticsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/organizationStatistics/getOrganizationStatistics/getOrganizationStatisticsErrors.ts",
        "method": "GET",
        "description": "Метод для получения статистики организации."
    }
]
*/
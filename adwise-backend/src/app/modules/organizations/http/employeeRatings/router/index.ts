import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { createEmployeeRatingController } from "../../../useCases/employeeRatings/createEmployeeRating";
import { getEmployeeRatingController } from "../../../useCases/employeeRatings/getEmployeeRating";
import { getEmployeeRatingsController } from "../../../useCases/employeeRatings/getEmployeeRatings";

export const employeeRatingRouter = Router();

employeeRatingRouter.post('/create-employee-rating', applyBlock, applyAuth, (req, res) => createEmployeeRatingController.execute(req, res));
employeeRatingRouter.get('/get-employee-rating/:id', applyBlock, applyAuth, (req, res) => getEmployeeRatingController.execute(req, res));
employeeRatingRouter.get('/get-employee-ratings/:id', applyBlock, (req, res) => getEmployeeRatingsController.execute(req, res));

/*
[
    {   
        "name": "create employee rating",
        "path": "/organizations/create-employee-rating",
        "dto": "src/app/modules/organizations/useCases/employeeRatings/createEmployeeRating/CreateEmployeeRatingDTO.ts",
        "errors": "src/app/modules/organizations/useCases/employeeRatings/createEmployeeRating/createEmployeeRatingErrors.ts",
        "method": "POST",
        "description": "Создаёт рейтинг сотрудника."
    },
    {   
        "name": "get employee rating",
        "path": "/organizations/get-employee-rating/{employeeRatingId}",
        "dto": "src/app/modules/organizations/useCases/employeeRatings/getEmployeeRating/GetEmployeeRatingDTO.ts",
        "errors": "src/app/modules/organizations/useCases/employeeRatings/getEmployeeRating/getEmployeeRatingErrors.ts",
        "method": "GET",
        "description": "Возвращает рейтинг сотрудника."
    },
    {   
        "name": "get employee ratings",
        "path": "/organizations/get-employee-ratings/{employeeId}",
        "dto": "src/app/modules/organizations/useCases/employeeRatings/getEmployeeRatings/GetEmployeeRatingsDTO.ts",
        "errors": "src/app/modules/organizations/useCases/employeeRatings/getEmployeeRatings/getEmployeeRatingsErrors.ts",
        "method": "GET",
        "description": "Возвращает рейтинги сотрудника."
    }
]
*/
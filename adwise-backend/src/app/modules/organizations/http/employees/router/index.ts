import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../../services/server/implementation/middleware/middlewares";
import { changeEmployeeRoleController } from "../../../useCases/employees/changeEmployeeRole";
import { createEmployeeController } from "../../../useCases/employees/createEmployee";
import { deleteEmployeeController } from "../../../useCases/employees/deleteEmployee";
import { getEmployeeController, getEmployeeUseCase } from "../../../useCases/employees/getEmployee";
import { setEmployeeDisabledController } from "../../../useCases/employees/setEmployeeDisabled";

const employeeRouter = Router();

employeeRouter.post('/create-employee', applyBlock, applyAuth, (req, res) => createEmployeeController.execute(req, res));
employeeRouter.put('/change-employee-role/:id', applyBlock, applyAuth, (req, res) => changeEmployeeRoleController.execute(req, res));
employeeRouter.delete('/delete-employee/:id', applyBlock, applyAuth, (req, res) => deleteEmployeeController.execute(req, res));
employeeRouter.put('/set-employee-disabled/:id', applyBlock, applyAuth, (req, res) => setEmployeeDisabledController.execute(req, res));
employeeRouter.get('/get-employee/:id', applyBlock, applyAuth, (req, res) => getEmployeeController.execute(req, res));

export {
    employeeRouter
};

/*
[
    {   
        "name": "create employee",
        "path": "/organizations/create-employee",
        "dto": "src/app/modules/organizations/useCases/employees/createEmployee/CreateEmployeeDTO.ts",
        "errors": "src/app/modules/organizations/useCases/employees/createEmployee/createEmployeeErrors.ts",
        "method": "POST",
        "description": "Создаёт сотрудника и добавляет его в организацию.",
        "tags": ["administration"]
    },
    {   
        "name": "change employee role",
        "path": "/organizations/change-employee-role",
        "dto": "src/app/modules/organizations/useCases/employees/changeEmployeeRole/ChangeEmployeeRoleDTO.ts",
        "errors": "src/app/modules/organizations/useCases/employees/changeEmployeeRole/changeEmployeeRoleErrors.ts",
        "method": "PUT",
        "description": "Изменяет роль сотрудника.",
        "tags": ["administration"]
    },
    {   
        "name": "set employee disabled",
        "path": "/organizations/set-employee-disabled",
        "dto": "src/app/modules/organizations/useCases/employees/setEmployeeDisabled/SetEmployeeDisabledDTO.ts",
        "errors": "src/app/modules/organizations/useCases/employees/setEmployeeDisabled/setEmployeeDisabledErrors.ts",
        "method": "PUT",
        "description": "Отключает/включает сотрудника.",
        "tags": ["administration"]
    },
    {   
        "name": "delete employee",
        "path": "/organizations/delete-employee",
        "dto": "src/app/modules/organizations/useCases/employees/deleteEmployee/DeleteEmployeeDTO.ts",
        "errors": "src/app/modules/organizations/useCases/employees/deleteEmployee/deleteEmployeeErrors.ts",
        "method": "DELETE",
        "description": "Удаляет сотрудника и организацию.",
        "tags": ["administration"]
    },
    {   
        "name": "get employee",
        "path": "/organizations/get-employee/{id}",
        "dto": "src/app/modules/organizations/useCases/employees/getEmployee/GetEmployeeDTO.ts",
        "errors": "src/app/modules/organizations/useCases/employees/getEmployee/getEmployeeErrors.ts",
        "method": "GET",
        "description": "Удаляет сотрудника и организацию.",
        "tags": ["administration"]
    }
]
*/
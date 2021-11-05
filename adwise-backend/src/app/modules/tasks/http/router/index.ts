import { Router } from "express";
import { applyAuth, applyBlock } from "../../../../services/server/implementation/middleware/middlewares";
import { createTaskController } from "../../useCases/createTask";
import { deleteTaskController } from "../../useCases/deleteTask";
import { getTaskController } from "../../useCases/getTask";
import { getTasksController } from "../../useCases/getTasks";

const taskRouter = Router();

taskRouter.get('/get-task/:id', applyBlock, applyAuth, (req, res) => getTaskController.execute(req, res));
taskRouter.get('/get-tasks/:id', applyBlock, applyAuth, (req, res) => getTasksController.execute(req, res));
taskRouter.post('/create-task', applyBlock, applyAuth, (req, res) => createTaskController.execute(req, res));
taskRouter.delete('/delete-task/:id', applyBlock, applyAuth, (req, res) => deleteTaskController.execute(req, res));

export {
    taskRouter
};

/*
[
    {   
        "name": "create task",
        "path": "/tasks/create-task",
        "dto": "src/app/modules/tasks/useCases/createTask/CreateTaskDTO.ts",
        "errors": "src/app/modules/tasks/useCases/createTask/createTaskErrors.ts",
        "method": "POST",
        "description": "Создаёт задачу и добавляет участников."
    },
    {   
        "name": "delete task",
        "path": "/tasks/delete-task/{id}",
        "dto": "src/app/modules/tasks/useCases/deleteTask/DeleteTaskDTO.ts",
        "errors": "src/app/modules/tasks/useCases/deleteTask/deleteTaskErrors.ts",
        "method": "DELETE",
        "description": "Удаляет задачу."
    },
    {   
        "name": "get task",
        "path": "/tasks/get-task/:id",
        "dto": "src/app/modules/tasks/useCases/getTask/GetTaskDTO.ts",
        "errors": "src/app/modules/tasks/useCases/getTask/getTaskErrors.ts",
        "method": "GET"
    },
    {   
        "name": "get tasks",
        "path": "/tasks/get-tasks/{contactId}",
        "dto": "src/app/modules/tasks/useCases/getTasks/GetTasksDTO.ts",
        "errors": "src/app/modules/tasks/useCases/getTasks/getTasksErrors.ts",
        "method": "GET",
        "description": "Возвращает все задачи, в которых пользователь является участником."
    }
]
*/
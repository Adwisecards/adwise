import { taskRepo } from "../../repo";
import { GetTasksController } from "./GetTasksController";
import { GetTasksUseCase } from "./GetTasksUseCase";

const getTasksUseCase = new GetTasksUseCase(taskRepo);
const getTasksController = new GetTasksController(getTasksUseCase);

export {
    getTasksUseCase,
    getTasksController
};
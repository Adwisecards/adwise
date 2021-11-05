import { taskRepo } from "../../repo";
import { GetTaskController } from "./GetTaskController";
import { GetTaskUseCase } from "./GetTaskUseCase";

const getTaskUseCase = new GetTaskUseCase(taskRepo);
const getTaskController = new GetTaskController(getTaskUseCase);

export {
    getTaskUseCase,
    getTaskController
};
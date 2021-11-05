import { taskRepo } from "../../repo";
import { DeleteTaskController } from "./DeleteTaskController";
import { DeleteTaskUseCase } from "./DeleteTaskUseCase";

const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo);
const deleteTaskController = new DeleteTaskController(deleteTaskUseCase);

export {
    deleteTaskUseCase,
    deleteTaskController
};
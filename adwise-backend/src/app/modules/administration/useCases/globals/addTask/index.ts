import { globalRepo } from "../../../repo/globals";
import { administrationValidationService } from "../../../services/administrationValidationService";
import { AddTaskController } from "./AddTaskController";
import { AddTaskUseCase } from "./AddTaskUseCase";

const addTaskUseCase = new AddTaskUseCase(globalRepo, administrationValidationService);
const addTaskController = new AddTaskController(addTaskUseCase);

export {
    addTaskUseCase,
    addTaskController
};
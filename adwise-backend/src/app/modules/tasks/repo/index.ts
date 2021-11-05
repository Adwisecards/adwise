import { TaskModel } from "../models/Task";
import { TaskRepo } from "./implementation/TaskRepo";

const taskRepo = new TaskRepo(TaskModel);

export {
    taskRepo
};
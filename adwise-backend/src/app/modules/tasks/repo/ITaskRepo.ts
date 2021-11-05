import { IRepo, RepoResult } from "../../../core/models/interfaces/IRepo";
import { ITask } from "../models/Task";

export interface ITaskRepo extends IRepo<ITask> {
    findTasksByContact(contactId: string): RepoResult<ITask[]>;
};
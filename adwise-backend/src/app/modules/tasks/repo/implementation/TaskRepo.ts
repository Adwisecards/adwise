import { Types } from "mongoose";
import { Repo } from "../../../../core/models/Repo";
import { RepoError } from "../../../../core/models/RepoError";
import { Result } from "../../../../core/models/Result";
import { ITask, ITaskModel } from "../../models/Task";
import { ITaskRepo } from "../ITaskRepo";

export class TaskRepo extends Repo<ITask, ITaskModel> implements ITaskRepo {
    public async findTasksByContact(contactId: string) {
        try {
            const tasks = await this.Model.find({
                participants: {$in: [new Types.ObjectId(contactId)]}
            });
    
            return Result.ok(tasks);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
};
import { Types } from "mongoose";
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { ITaskRepo } from "../../repo/ITaskRepo";
import { DeleteTaskDTO } from "./DeleteTaskDTO";
import { deleteTaskErrors } from "./deleteTaskErrors";

export class DeleteTaskUseCase implements IUseCase<DeleteTaskDTO.Request, DeleteTaskDTO.Response> {
    private taskRepo: ITaskRepo;
    public errors: UseCaseError[] = [
        ...deleteTaskErrors
    ];

    constructor(taskRepo: ITaskRepo) {
        this.taskRepo = taskRepo;
    }

    public async execute(req: DeleteTaskDTO.Request): Promise<DeleteTaskDTO.Response> {
        if (!Types.ObjectId.isValid(req.taskId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const taskFound = await this.taskRepo.findById(req.taskId);
        if (taskFound.isFailure) {
            return Result.fail(taskFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding task') : UseCaseError.create('b'));
        }

        const taskDeleted = await this.taskRepo.deleteById(req.taskId);
        if (taskDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting task'));
        }

        return Result.ok({taskId: req.taskId});
    }
}
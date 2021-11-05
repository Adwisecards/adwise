import { Types } from "mongoose";
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { ITaskRepo } from "../../repo/ITaskRepo";
import { GetTaskDTO } from "./GetTaskDTO";
import { getTaskErrors } from "./getTaskErrors";

export class GetTaskUseCase implements IUseCase<GetTaskDTO.Request, GetTaskDTO.Response> {
    private taskRepo: ITaskRepo;
    public errors: UseCaseError[] = [
        ...getTaskErrors
    ];

    constructor(taskRepo: ITaskRepo) {
        this.taskRepo = taskRepo;
    }

    public async execute(req: GetTaskDTO.Request): Promise<GetTaskDTO.Response> {
        if (!Types.ObjectId.isValid(req.taskId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const taskFound = await this.taskRepo.findById(req.taskId);
        if (taskFound.isFailure) {
            return Result.fail(taskFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const task = taskFound.getValue()!;
        return Result.ok({task});
    }
}
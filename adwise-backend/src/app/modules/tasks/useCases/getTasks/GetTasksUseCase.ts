import { Types } from "mongoose";
import { IUseCase } from "../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../core/models/Result";
import { UseCaseError } from "../../../../core/models/UseCaseError";
import { ITaskRepo } from "../../repo/ITaskRepo";
import { GetTasksDTO } from "./GetTasksDTO";
import { getTasksErrors } from "./getTasksErrors";

export class GetTasksUseCase implements IUseCase<GetTasksDTO.Request, GetTasksDTO.Response> {
    private taskRepo: ITaskRepo;
    
    public errors: UseCaseError[] = [
        ...getTasksErrors
    ];
    constructor(taskRepo: ITaskRepo) {
        this.taskRepo = taskRepo;
    } 

    public async execute(req: GetTasksDTO.Request): Promise<GetTasksDTO.Response> {
        if (!Types.ObjectId.isValid(req.contactId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const tasksFound = await this.taskRepo.findTasksByContact(req.contactId);
        if (tasksFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding tasks'));
        }

        const tasks = tasksFound.getValue()!;
        return Result.ok({tasks})
    }
}
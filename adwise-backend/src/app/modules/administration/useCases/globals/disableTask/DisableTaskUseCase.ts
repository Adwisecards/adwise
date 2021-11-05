import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IGlobalRepo } from "../../../repo/globals/IGlobalRepo";

import { DisableTaskDTO } from "./DisableTaskDTO";
import { disableTaskErrors } from "./disableTaskErrors";

export class DisableTaskUseCase implements IUseCase<DisableTaskDTO.Request, DisableTaskDTO.Response> {
    private globalRepo: IGlobalRepo;

    public errors = [
        ...disableTaskErrors
    ];

    constructor(globalRepo: IGlobalRepo) {
        this.globalRepo = globalRepo;
    }

    public async execute(req: DisableTaskDTO.Request): Promise<DisableTaskDTO.Response> {
        if (typeof req.disabled != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'disabled is not valid'));
        }

        if (!Types.ObjectId.isValid(req.taskId)) {
            return Result.fail(UseCaseError.create('c', 'taskId is not valid'));
        }

        const globalGotten = await this.globalRepo.getGlobal()!;
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const taskIndex = global.tasks.findIndex(t => t._id.toString() == req.taskId);
        if (taskIndex == -1) {
            return Result.fail(UseCaseError.create('b', 'Task does not exist'));
        }

        global.tasks[taskIndex].disabled = req.disabled;

        const globalSaved = await this.globalRepo.save(global);
        if (globalSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving global'));
        }

        return Result.ok({taskId: req.taskId});
    }
}
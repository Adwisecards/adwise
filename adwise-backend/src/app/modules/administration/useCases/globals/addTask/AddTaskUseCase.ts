import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { WithdrawalTaskModel } from "../../../models/WithdrawalTask";
import { IGlobalRepo } from "../../../repo/globals/IGlobalRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { AddTaskDTO } from "./AddTaskDTO";
import { addTaskErrors } from "./addTaskErrors";

export class AddTaskUseCase implements IUseCase<AddTaskDTO.Request, AddTaskDTO.Response> {
    private globalRepo: IGlobalRepo;
    private administrationValidationService: IAdministrationValidationService;
    public errors = [
        ...addTaskErrors
    ];
    constructor(globalRepo: IGlobalRepo, administrationValidationService: IAdministrationValidationService) {
        this.globalRepo = globalRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: AddTaskDTO.Request): Promise<AddTaskDTO.Response> {
        const valid = await this.administrationValidationService.addTaskData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const globalFound = await this.globalRepo.getGlobal();
        if (globalFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalFound.getValue()!;


        const task = new WithdrawalTaskModel({
            name: req.name,
            description: req.description,
            disabled: req.disabled,
            points: req.points
        });

        global.tasks.push(task);
        
        const globalSaved = await this.globalRepo.save(global);
        if (globalSaved.isFailure) {
            console.log(globalSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving global'));
        }

        return Result.ok({
            taskId: task._id
        });
    }
}
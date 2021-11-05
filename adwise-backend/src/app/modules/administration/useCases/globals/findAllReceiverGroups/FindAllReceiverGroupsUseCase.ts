import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IReceiverGroupRepo } from "../../../../notification/repo/receiverGroups/IReceiverGroupRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllReceiverGroupsDTO } from "./FindAllReceiverGroupsDTO";
import { findAllReceiverGroupsErrors } from "./findAllReceiverGroupsErrors";

export class FindAllReceiverGroupsUseCase implements IUseCase<FindAllReceiverGroupsDTO.Request, FindAllReceiverGroupsDTO.Response> {
    private receiverGroupRepo: IReceiverGroupRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllReceiverGroupsErrors;

    constructor(receiverGroupRepo: IReceiverGroupRepo, administrationValidationService: IAdministrationValidationService) {
        this.receiverGroupRepo = receiverGroupRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllReceiverGroupsDTO.Request): Promise<FindAllReceiverGroupsDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber' || key == 'export') continue;
            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        const receiverGroupsFound = await this.receiverGroupRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'receivers');
        if (receiverGroupsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding receiver groups'));
        }
        
        const receiverGroups = receiverGroupsFound.getValue()!;

        const countFound = await this.receiverGroupRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({
            count,
            receiverGroups
        });
    }
}
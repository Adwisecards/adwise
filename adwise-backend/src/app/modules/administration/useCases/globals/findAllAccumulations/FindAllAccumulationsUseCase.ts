import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IAccumulationRepo } from "../../../../finance/repo/accumulations/IAccumulationRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllAccumulationsDTO } from "./FindAllAccumulationsDTO";
import { findAllAccumulationsErrors } from "./findAllAccumulationsErrors";

export class FindAllAccumulationsUseCase implements IUseCase<FindAllAccumulationsDTO.Request, FindAllAccumulationsDTO.Response> {
    private accumulationRepo: IAccumulationRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllAccumulationsErrors;

    constructor(accumulationRepo: IAccumulationRepo, administrationValidationService: IAdministrationValidationService) {
        this.accumulationRepo = accumulationRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllAccumulationsDTO.Request): Promise<FindAllAccumulationsDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber') continue;

            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        const accumulationsFound = await this.accumulationRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'user');
        if (accumulationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding accumulations'));
        }

        const accumulations = accumulationsFound.getValue()!;

        const countFound = await this.accumulationRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;
        
        return Result.ok({accumulations, count});
    }
}
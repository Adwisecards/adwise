import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ILogRepo } from "../../../../logs/repo/ILogRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllLogsDTO } from "./FindAllLogsDTO";
import { findAllLogsErrors } from "./findAllLogsErrors";

export class FindAllLogsUseCase implements IUseCase<FindAllLogsDTO.Request, FindAllLogsDTO.Response> {
    private logRepo: ILogRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllLogsErrors;

    constructor(logRepo: ILogRepo, administrationValidationService: IAdministrationValidationService) {
        this.logRepo = logRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllLogsDTO.Request): Promise<FindAllLogsDTO.Response> {
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

        const logsFound = await this.logRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'user');
        if (logsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding logs'));
        }

        const logs = logsFound.getValue()!;

        const countFound = await this.logRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({logs, count});
    }
}
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ITipsRepo } from "../../../../finance/repo/tips/ITipsRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllTipsDTO } from "./FindAllTipsDTO";
import { findAllTipsErrors } from "./findAllTipsErrors";

export class FindAllTipsUseCase implements IUseCase<FindAllTipsDTO.Request, FindAllTipsDTO.Response> {
    private tipsRepo: ITipsRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllTipsErrors;

    constructor(tipsRepo: ITipsRepo, administrationValidationService: IAdministrationValidationService) {
        this.tipsRepo = tipsRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllTipsDTO.Request): Promise<FindAllTipsDTO.Response> {
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

        const tipsFound = await this.tipsRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'to from organization purchase');
        if (tipsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding tips'));
        }

        const tips = tipsFound.getValue()!;

        const countFound = await this.tipsRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({tips, count});
    }
}
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ILegalInfoRequestRepo } from "../../../../organizations/repo/legalInfoRequests/ILegalInfoRequestRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllLegalInfoRequestsDTO } from "./FindAllLegalInfoRequestsDTO";
import { findAllLegalInfoRequestErrors } from "./findAllLegalInfoRequestsErrors";

export class FindAllLegalInfoRequestsUseCase implements IUseCase<FindAllLegalInfoRequestsDTO.Request, FindAllLegalInfoRequestsDTO.Response> {
    private legalInfoRequestRepo: ILegalInfoRequestRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllLegalInfoRequestErrors;

    constructor(
        legalInfoRequestRepo: ILegalInfoRequestRepo,
        administrationValidationService: IAdministrationValidationService
    ) {
        this.legalInfoRequestRepo = legalInfoRequestRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllLegalInfoRequestsDTO.Request): Promise<FindAllLegalInfoRequestsDTO.Response> {
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

        const legalInfoRequestsFound = await this.legalInfoRequestRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'offer');
        if (legalInfoRequestsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding legalInfoRequests'));
        }

        const legalInfoRequests = legalInfoRequestsFound.getValue()!;

        const countFound = await this.legalInfoRequestRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({
            count,
            legalInfoRequests
        });      
    }
}
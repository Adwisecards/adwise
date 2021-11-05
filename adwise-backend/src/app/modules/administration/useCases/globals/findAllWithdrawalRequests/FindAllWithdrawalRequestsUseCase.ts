import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IWithdrawalRequestRepo } from "../../../../finance/repo/withdrawalRequests/IWithdrawalRequestRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllWithdrawalRequestsDTO } from "./FindAllWithdrawalRequestsDTO";
import { findAllWithdrawalRequestsErrors } from "./findAllWithdrawalRequestsErrors";

export class FindAllWithdrawalRequestsUseCase implements IUseCase<FindAllWithdrawalRequestsDTO.Request, FindAllWithdrawalRequestsDTO.Response> {
    private withdrawalRequestRepo: IWithdrawalRequestRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = [
        ...findAllWithdrawalRequestsErrors
    ];

    constructor(withdrawalRequestRepo: IWithdrawalRequestRepo, administrationValidationService: IAdministrationValidationService) {
        this.withdrawalRequestRepo = withdrawalRequestRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllWithdrawalRequestsDTO.Request): Promise<FindAllWithdrawalRequestsDTO.Response> {
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

        const withdrawalRequestsFound = await this.withdrawalRequestRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'user organization wallet');
        if (withdrawalRequestsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding withdrawal requests'));
        }

        const withdrawalRequests = withdrawalRequestsFound.getValue()!;

        const countFound = await this.withdrawalRequestRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({
            withdrawalRequests: withdrawalRequests,
            count
        });
    }
}
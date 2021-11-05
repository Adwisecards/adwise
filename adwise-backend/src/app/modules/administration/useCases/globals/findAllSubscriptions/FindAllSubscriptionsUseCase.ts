import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllSubscriptionsDTO } from "./FindAllSubscriptionsDTO";
import { findAllSubscriptionsErrors } from "./findAllSubscriptionsErrors";

export class FindAllSubscriptionsUseCase implements IUseCase<FindAllSubscriptionsDTO.Request, FindAllSubscriptionsDTO.Response> {
    private subscriptionRepo: ISubscriptionRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllSubscriptionsErrors;

    constructor(subscriptionRepo: ISubscriptionRepo, administrationValidationService: IAdministrationValidationService) {
        this.subscriptionRepo = subscriptionRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllSubscriptionsDTO.Request): Promise<FindAllSubscriptionsDTO.Response> {
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

        const subscriptionsFound = await this.subscriptionRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'organization subscriber parent root');
        if (subscriptionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding subscriptions'));
        }

        const subscriptions = subscriptionsFound.getValue()!;

        const countFound = await this.subscriptionRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({subscriptions, count});
    }
}

import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscriptionCreatedRecordRepo } from "../../../../finance/repo/subscriptionCreatedRecords/ISubscriptionCreatedRecordRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindSubscriptionCreatedRecordsDTO } from "./FindSubscriptionCreatedRecordsDTO";
import { findSubscriptionCreatedRecordsErrors } from "./findSubscriptionCreatedRecordsErrors";

export class FindSubscriptionCreatedRecordsUseCase implements IUseCase<FindSubscriptionCreatedRecordsDTO.Request, FindSubscriptionCreatedRecordsDTO.Response> {
    private administrationValidationService: IAdministrationValidationService;
    private subscriptionCreatedRecordRepo: ISubscriptionCreatedRecordRepo;

    public errors = findSubscriptionCreatedRecordsErrors;

    constructor(subscriptionCreatedRecordRepo: ISubscriptionCreatedRecordRepo, administrationValidationService: IAdministrationValidationService) {
        this.subscriptionCreatedRecordRepo = subscriptionCreatedRecordRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindSubscriptionCreatedRecordsDTO.Request): Promise<FindSubscriptionCreatedRecordsDTO.Response> {
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

        const subscriptionCreatedRecordsFound = await this.subscriptionCreatedRecordRepo.search(
            parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 
            '\
            inviter invitee \
            subscription subscription.organization subscription.subscriber \
            oldParent oldParent.organization oldParent.subscriber \
            newParent newParent.organization newParent.subscriber \
            ');
        if (subscriptionCreatedRecordsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding subscription created record'));
        }

        const subscriptionCreatedRecords = subscriptionCreatedRecordsFound.getValue()!;

        const countFound = await this.subscriptionCreatedRecordRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({subscriptionCreatedRecords, count})
    }
}
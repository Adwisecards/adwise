import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { SubscriptionCreatedRecordModel } from "../../../models/SubscriptionCreatedRecord";
import { ISubscriptionCreatedRecordRepo } from "../../../repo/subscriptionCreatedRecords/ISubscriptionCreatedRecordRepo";
import { CreateSubscriptionCreatedRecordDTO } from "./CreateSubscriptionCreatedRecordDTO";
import { createSubscriptionCreatedRecordErrors } from "./createSubscriptionCreatedRecordErrors";

export class CreateSubscriptionCreatedRecordUseCase implements IUseCase<CreateSubscriptionCreatedRecordDTO.Request, CreateSubscriptionCreatedRecordDTO.Response> {
    private subscriptionCreatedRecordRepo: ISubscriptionCreatedRecordRepo;
    
    public errors = createSubscriptionCreatedRecordErrors;

    constructor(subscriptionCreatedRecordRepo: ISubscriptionCreatedRecordRepo) {
        this.subscriptionCreatedRecordRepo = subscriptionCreatedRecordRepo;
    }

    public async execute(req: CreateSubscriptionCreatedRecordDTO.Request): Promise<CreateSubscriptionCreatedRecordDTO.Response> {
        const subscriptionCreatedRecord = new SubscriptionCreatedRecordModel({
            subscription: req.subscription,
            invitation: req.invitation,
            organization: req.organization,
            invitee: req.invitee,
            inviter: req.inviter,
            oldParent: req.oldParent,
            newParent: req.newParent,
            reason: req.reason
        });

        const subscriptionCreatedRecordSaved = await this.subscriptionCreatedRecordRepo.save(subscriptionCreatedRecord);
        if (subscriptionCreatedRecordSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving subscription created record'));
        }

        return Result.ok({subscriptionCreatedRecordId: subscriptionCreatedRecord._id});
    }
}
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscriptionRepo } from "../../../repo/subscriptions/ISubscriptionRepo";
import { GetOtherLevelSubscriptionsDTO } from "./GetOtherLevelSubscriptionsDTO";
import { getOtherLevelSubscriptionsErrors } from "./getOtherLevelSubscriptionsErrors";

export class GetOtherLevelSubscriptionsUseCase implements IUseCase<GetOtherLevelSubscriptionsDTO.Request, GetOtherLevelSubscriptionsDTO.Response> {
    private subscriptionRepo: ISubscriptionRepo;
    public errors = [
        ...getOtherLevelSubscriptionsErrors
    ];

    constructor(subscriptionRepo: ISubscriptionRepo) {
        this.subscriptionRepo = subscriptionRepo;
    }

    public async execute(req: GetOtherLevelSubscriptionsDTO.Request): Promise<GetOtherLevelSubscriptionsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const subscriptionsFound = await this.subscriptionRepo.findByUserAndNotLevel(req.userId, 1);
        if (subscriptionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding subscriptions'));
        }

        const subscriptions = subscriptionsFound.getValue()!;
        
        return Result.ok({subscriptions});
    }
}
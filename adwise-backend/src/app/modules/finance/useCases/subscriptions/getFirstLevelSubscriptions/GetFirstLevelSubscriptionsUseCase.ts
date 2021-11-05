import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscriptionRepo } from "../../../repo/subscriptions/ISubscriptionRepo";
import { GetFirstLevelSubscriptionsDTO } from "./GetFirstLevelSubscriptionsDTO";
import {getFirstLevelSubscriptionsErrors} from './getFirstLevelSubscriptionsErrors';

export class GetFirstLevelSubscriptionsUseCase implements IUseCase<GetFirstLevelSubscriptionsDTO.Request, GetFirstLevelSubscriptionsDTO.Response> {
    private subscriptionRepo: ISubscriptionRepo;
    public errors = [
        ...getFirstLevelSubscriptionsErrors
    ];

    constructor(subscriptionRepo: ISubscriptionRepo) {
        this.subscriptionRepo = subscriptionRepo;
    }

    public async execute(req: GetFirstLevelSubscriptionsDTO.Request): Promise<GetFirstLevelSubscriptionsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const subscriptionsFound = await this.subscriptionRepo.findByUserAndLevel(req.userId, 1);
        if (subscriptionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding subscriptions'));
        }

        const subscriptions = subscriptionsFound.getValue()!;
        
        return Result.ok({subscriptions});
    }
}
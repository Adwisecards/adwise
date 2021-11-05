import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscriptionRepo } from "../../../repo/subscriptions/ISubscriptionRepo";
import { GetLevelSubscriptionsDTO } from "./GetLevelSubscriptionsDTO";
import { getLevelSubscriptionsErrors } from "./getLevelSubscriptionsErrors";

export class GetLevelSubscriptionsUseCase implements IUseCase<GetLevelSubscriptionsDTO.Request, GetLevelSubscriptionsDTO.Response> {
    private subscriptionRepo: ISubscriptionRepo;
    public errors = [
        ...getLevelSubscriptionsErrors
    ];

    constructor(subscriptionRepo: ISubscriptionRepo) {
        this.subscriptionRepo = subscriptionRepo;
    }

    public async execute(req: GetLevelSubscriptionsDTO.Request): Promise<GetLevelSubscriptionsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId) || !Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'userId or level is not valid'));
        }

        const subscriptionFound = await this.subscriptionRepo.findByUserAndOrganization(req.userId, req.organizationId);
        if (subscriptionFound.isFailure) {
            return Result.fail(subscriptionFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const subscription = subscriptionFound.getValue()!;

        const subscriptions: GetLevelSubscriptionsDTO.ISubscriptionLevel[] = [];
        let parentIds = [subscription._id];
        let userLevel = 1;
        for (let level = 2; level <= 22; level++) {
            if (level == 2) {
                const subscriptionsFound = await this.subscriptionRepo.findByParentsAndOrganization(parentIds, req.organizationId);
                if (subscriptionsFound.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon finding subscriptions'));
                }

                const levelSubscriptions = subscriptionsFound.getValue()!;
                subscriptions.push({
                    level: userLevel++,
                    items: subscriptionsFound.getValue()!
                });

                parentIds = levelSubscriptions.map(s => s._id);
            } else {
                const subscriptionsFound = await this.subscriptionRepo.findByParentsAndOrganization(parentIds, req.organizationId);
                if (subscriptionsFound.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon finding subscriptions'));
                }

                const levelSubscriptions = subscriptionsFound.getValue()!;
                subscriptions.push({
                    level: userLevel++,
                    items: subscriptionsFound.getValue()!
                });

                parentIds = levelSubscriptions.map(s => s._id);
            }
        }

        return Result.ok({subscriptions});
    }
}
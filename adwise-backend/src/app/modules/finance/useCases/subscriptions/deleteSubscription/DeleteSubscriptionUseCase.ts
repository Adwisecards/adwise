import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscriptionRepo } from "../../../repo/subscriptions/ISubscriptionRepo";
import { DeleteSubscriptionDTO } from "./DeleteSubscriptionDTO";
import { deleteSubscriptionErrors } from "./deleteSubscriptionErrors";

export class DeleteSubscriptionUseCase implements IUseCase<DeleteSubscriptionDTO.Request, DeleteSubscriptionDTO.Response> {
    private subscriptionRepo: ISubscriptionRepo;
    public errors: UseCaseError[] = [
        ...deleteSubscriptionErrors
    ];
    constructor(subscriptionRepo: ISubscriptionRepo) {
        this.subscriptionRepo = subscriptionRepo;
    }

    public async execute(req: DeleteSubscriptionDTO.Request): Promise<DeleteSubscriptionDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId) || !Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c'));
        }

        const subscriptionFound = await this.subscriptionRepo.findByUserAndOrganization(req.userId, req.organizationId);
        if (subscriptionFound.isFailure) {
            return Result.fail(subscriptionFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('n'))
        }

        const subscription = subscriptionFound.getValue()!;
        // TEMP
        if (true || subscription.children.length > 0) {
            return Result.ok({subscriptionId: subscription._id});
        }

        if (subscription.parent) {
            const parentSubscriptionFound = await this.subscriptionRepo.findById(subscription.parent.toHexString());
            if (parentSubscriptionFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding parent subscription'));
            }

            const parentSubscription = parentSubscriptionFound.getValue()!;

            const childIndex = parentSubscription.children.findIndex(i => i.toHexString() == subscription._id.toString());

            if (childIndex != -1) {
                parentSubscription.children.splice(childIndex, 1);
            }
            
            const parentSubscriptionSaved = await this.subscriptionRepo.save(parentSubscription);
            if (parentSubscriptionSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving parent subscription'));
            }
        }

        const subscriptionDeleted = await this.subscriptionRepo.deleteById(subscription._id);
        if (subscriptionDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting subscription'));
        }

        return Result.ok({subscriptionId: subscription._id});

    }
}
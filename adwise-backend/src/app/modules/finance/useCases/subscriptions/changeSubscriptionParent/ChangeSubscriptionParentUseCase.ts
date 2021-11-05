import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { ISubscription } from "../../../models/Subscription";
import { ISubscriptionRepo } from "../../../repo/subscriptions/ISubscriptionRepo";
import { ISubscriptionValidationService } from "../../../services/subscriptions/subscriptionValidationService/ISubscriptionValidationService";
import { CreateSubscriptionCreatedRecordUseCase } from "../../subscriptionCreatedRecords/createSubscriptionCreatedRecord/CreateSubscriptionCreatedRecordUseCase";
import { ChangeSubscriptionParentDTO } from "./ChangeSubscriptionParentDTO";
import { changeSubscriptionParentErrors } from "./changeSubscriptionParentErrors";

interface IKeyObjects {
    subscription: ISubscription;
    parent: ISubscription;
    oldParent?: ISubscription;
    organization: IOrganization;
};

export class ChangeSubscriptionParentUseCase implements IUseCase<ChangeSubscriptionParentDTO.Request, ChangeSubscriptionParentDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private subscriptionRepo: ISubscriptionRepo;
    private subscriptionValidationService: ISubscriptionValidationService;
    private createSubscriptionCreatedRecord: CreateSubscriptionCreatedRecordUseCase;

    public errors = changeSubscriptionParentErrors;

    constructor(
        organizationRepo: IOrganizationRepo,
        subscriptionRepo: ISubscriptionRepo, 
        subscriptionValidationService: ISubscriptionValidationService,
        createSubscriptionCreatedRecord: CreateSubscriptionCreatedRecordUseCase
    ) {
        this.organizationRepo = organizationRepo;
        this.subscriptionRepo = subscriptionRepo;
        this.subscriptionValidationService = subscriptionValidationService;
        this.createSubscriptionCreatedRecord = createSubscriptionCreatedRecord;
    }

    public async execute(req: ChangeSubscriptionParentDTO.Request): Promise<ChangeSubscriptionParentDTO.Response> {
        const valid = this.subscriptionValidationService.changeParentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.subscriptionId, req.parentId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            organization,
            parent,
            subscription,
            oldParent
        } = keyObjectsGotten.getValue()!;

        

        if (oldParent) {
            const subscriptionIndex = oldParent.children.findIndex(s => s.toString() == subscription._id.toString());
            if (subscriptionIndex != -1) {
                oldParent.children.splice(subscriptionIndex, 1);
            }

            const oldParentSaved = await this.subscriptionRepo.save(oldParent);
            if (oldParentSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving old subscription parent'));
            }
        }

        parent.children.push(subscription._id.toString());

        subscription.parent = parent._id;

        subscription.root = parent.root;

        subscription.level = parent.level + 1;
        if (subscription.level > 21) {
            subscription.level = 1;
        }

        await this.bfs(subscription, parent.root.toString());

        const parentSaved = await this.subscriptionRepo.save(parent);
        if (parentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving subscription parent'));
        }

        const subscriptionSaved = await this.subscriptionRepo.save(subscription);
        if (subscriptionSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving subscription'));
        }

        await this.createSubscriptionCreatedRecord.execute({
            invitation: undefined as any,
            subscription: subscription,
            organization: organization,
            invitee: undefined as any,
            inviter: undefined as any,
            oldParent: oldParent!,
            newParent: parent,
            reason: req.reason
        });

        return Result.ok({subscriptionId: req.subscriptionId});        
    }

    private async getKeyObjects(subscriptionId: string, parentId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const subscriptionFound = await this.subscriptionRepo.findById(subscriptionId);
        if (subscriptionFound.isFailure) {
            return Result.fail(subscriptionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding subscruiption') : UseCaseError.create('n'));
        }

        const subscription = subscriptionFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(subscription.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding organization") : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;
        
        const parentFound = await this.subscriptionRepo.findById(parentId);
        if (parentFound.isFailure) {
            return Result.fail(parentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding parent subscription') : UseCaseError.create('n', 'Parent subscription does not exist'));
        }

        const parent = parentFound.getValue()!;

        let oldParent: ISubscription | undefined;
        if (subscription.parent) {
            const oldParentFound = await this.subscriptionRepo.findById(subscription.parent.toString());
            if (oldParentFound.isFailure) {
                return Result.fail(oldParentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding old subscription parent') : UseCaseError.create('n', 'Old subscription parent does not exist'));
            }

            oldParent = oldParentFound.getValue()!;
        }

        return Result.ok({
            organization,
            parent,
            subscription,
            oldParent
        });
    }

    private async bfs(subscription: ISubscription, rootId: string): Promise<ISubscription> {
        const queue: [ISubscription, number][] = [];

        queue.unshift([subscription, subscription.level]) ;

        while (queue.length) {
            let [current, level] = queue.pop()!;

            if (level > 21) {
                level = 1;
            }

            current.root = new Types.ObjectId(rootId);
            current.level = level;

            const currentSaved = await this.subscriptionRepo.save(current);
            if (currentSaved.isFailure) {
                return subscription;
            }

            for (const child of current.children) {
                
                let subscriptionChild: ISubscription;
                
                const childFound = await this.subscriptionRepo.findById(child.toString());
               
                if (childFound.isSuccess) {
                    subscriptionChild = childFound.getValue()!;
                }

                if (subscriptionChild!) {
                    queue.unshift([subscriptionChild!, level+1]);
                }
            }
        }

        return subscription;
    }
}
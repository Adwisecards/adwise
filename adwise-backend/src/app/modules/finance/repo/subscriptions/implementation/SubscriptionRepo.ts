import { request } from "express";
import { RepoResult } from "../../../../../core/models/interfaces/IRepo";
import { Repo } from "../../../../../core/models/Repo";
import { RepoError } from "../../../../../core/models/RepoError";
import { Result } from "../../../../../core/models/Result";
import { ISubscription, ISubscriptionModel } from "../../../models/Subscription";
import { ISubscriptionRepo } from "../ISubscriptionRepo";

export class SubscriptionRepo extends Repo<ISubscription, ISubscriptionModel> implements ISubscriptionRepo {
    public async findByUserAndOrganization(userId: string, organizationId: string) {
        try {
            const subscription = await this.Model.findOne({subscriber: userId, organization: organizationId});
            if (!subscription) {
                return Result.fail(new RepoError('Subscription is not found', 404));
            }

            return Result.ok(subscription);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByUserAndLevel(userId: string, level: number) {
        try {
            const subscriptions = await this.Model.find({
                subscriber: userId,
                level: level 
            });

            return Result.ok(subscriptions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByUserAndNotLevel(userId: string, level: number) {
        try {
            const subscriptions = await this.Model.find({
                subscriber: userId,
                level: {$ne: level}
            });

            return Result.ok(subscriptions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByUserAndOrganizationAndLevel(userId: string, organizationId: string, level: number) {
        try {
            const subscription = await this.Model.findOne({
                subscriber: userId,
                level: level,
                organization: organizationId
            });

            return Result.ok(subscription);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByRootAndOrganizationAndLevel(rootId: string, organizationId: string, level: number) {
        try {
            const subscriptions = await this.Model.find({
                root: rootId,
                level: level,
                organization: organizationId
            });

            return Result.ok(subscriptions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByRootAndOrganizationAndLevelCount(rootId: string, organizationId: string, level: number) {
        try {
            const subscriptions = await this.Model.countDocuments({
                root: rootId,
                level: level,
                organization: organizationId
            });

            return Result.ok(subscriptions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByParentIdsCount(parentIds: string[]) {
        try {
            const subscriptions = await this.Model.countDocuments({
                parent: {$in: parentIds}
            });

            return Result.ok(subscriptions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findSubscriptionsByUser(userId: string) {
        try {
            const subscriptions = await this.Model.find({
                subscriber: userId
            });

            return Result.ok(subscriptions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByOrganizationAndLevel(organizationId: string, level: number) {
        try {
            let subscriptions = await this.Model.find({
                organization: organizationId,
                level: level
            });

            return new Promise<any>(resolve => (<any>this.Model).deepPopulate(subscriptions, 'children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children subscriber children.subscriber children.children.subscriber children.children.children.subscriber children.children.children.children.subscriber children.children.children.children.children.subscriber children.children.children.children.children.children.subscriber children.children.children.children.children.children.children.subscriber children.children.children.children.children.children.children.children.subscriber children.children.children.children.children.children.children.children.children.subscriber children.children.children.children.children.children.children.children.children.subscriber children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.children.subscriber', (error: Error, subs: ISubscription) => {
                if (error) return resolve(Result.fail(new RepoError(error.message, 500)));
                return resolve(Result.ok(subs))
            }))

            
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }

    public async findByParentsAndOrganization(parentIds: string[], organizationId: string) {
        try {
            const subscriptions = await this.Model.find({parent: {$in: parentIds}, organization: organizationId});

            return Result.ok(subscriptions);
        } catch (ex) {
            return Result.fail(new RepoError(ex.message, 500));
        }
    }
}
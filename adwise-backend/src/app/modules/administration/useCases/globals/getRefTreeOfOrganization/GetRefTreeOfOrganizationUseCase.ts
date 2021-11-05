import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ISubscription } from "../../../../finance/models/Subscription";
import { ISubscriptionRepo } from "../../../../finance/repo/subscriptions/ISubscriptionRepo";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { GetRefTreeOfOrganizationDTO } from "./GetRefTreeOfOrganizationDTO";
import { getRefTreeOfOrganizationErrors } from "./getRefTreeOfOrganizationErrors";

export class GetRefTreeOfOrganizationUseCase implements IUseCase<GetRefTreeOfOrganizationDTO.Request, GetRefTreeOfOrganizationDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private subscriptionRepo: ISubscriptionRepo;
    public errors = [
        ...getRefTreeOfOrganizationErrors
    ];

    constructor(organizationRepo: IOrganizationRepo, subscriptionRepo: ISubscriptionRepo) {
        this.organizationRepo = organizationRepo;
        this.subscriptionRepo = subscriptionRepo;
    }

    public async execute(req: GetRefTreeOfOrganizationDTO.Request): Promise<GetRefTreeOfOrganizationDTO.Response> {
        if (!Types.ObjectId(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId'));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('b', 'Organization does not exist'));
        }

        const organization = organizationFound.getValue()!;

        const rootSubscriptionsFound = await this.subscriptionRepo.findByOrganizationAndLevel(organization._id, 1);
        if (rootSubscriptionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding root subscriptions'));
        }

        const rootSubscriptions = rootSubscriptionsFound.getValue()!;

        return Result.ok({tree: rootSubscriptions as any});
    }
}
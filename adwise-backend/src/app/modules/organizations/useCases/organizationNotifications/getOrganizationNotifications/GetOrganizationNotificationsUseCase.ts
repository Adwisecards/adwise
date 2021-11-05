import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";
import { IOrganization } from "../../../models/Organization";
import { IOrganizationNotification } from "../../../models/OrganizationNotification";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IOrganizationNotificationRepo } from "../../../repo/organizationNotifications/IOrganizationNotificationRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationNotificationValidationService } from "../../../services/organizationNotifications/organizationNotificationValidationService/IOrganizationNotificationValidationService";
import { GetOrganizationNotificationsDTO } from "./GetOrganizationNotificationsDTO";
import { getOrganizationNotificationsErrors } from './getOrganizationNotificationsErrors';

interface IKeyObjects {
    organization: IOrganization;
    organizationNotifications: IOrganizationNotification[];
    count: number;
};

export class GetOrganizationNotificationsUseCase implements IUseCase<GetOrganizationNotificationsDTO.Request, GetOrganizationNotificationsDTO.Response> {

    private organizationRepo: IOrganizationRepo;
    private organizationNotificationRepo: IOrganizationNotificationRepo;
    private organizationNotificationValidationService: IOrganizationNotificationValidationService;

    public errors = getOrganizationNotificationsErrors;

    constructor(
        organizationRepo: IOrganizationRepo,
        organizationNotificationRepo: IOrganizationNotificationRepo,
        organizationNotificationValidationService: IOrganizationNotificationValidationService
    ) {
        this.organizationRepo = organizationRepo;
        this.organizationNotificationRepo = organizationNotificationRepo;
        this.organizationNotificationValidationService = organizationNotificationValidationService;
    }

    public async execute(req: GetOrganizationNotificationsDTO.Request): Promise<GetOrganizationNotificationsDTO.Response> {
        const valid = this.organizationNotificationValidationService.getOrganizationNotificationsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(
            req.organizationId,
            req.seen,
            req.limit,
            req.page
        );

        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            organization,
            organizationNotifications,
            count
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != req.userId) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        const organizationNotificationIds = organizationNotifications.map(on => on._id.toString());

        await this.markOrganizationNotificationsAsSeen(organizationNotificationIds);

        return Result.ok({organizationNotifications, count});
    }

    private async markOrganizationNotificationsAsSeen(organizationNotificationIds: string[]): Promise<Result<true | null, UseCaseError | null>> {
        if (!organizationNotificationIds.length) {
            return Result.ok(true);
        }
        
        const organizationNotificationsUpdated = await this.organizationNotificationRepo.updateManySeenByIds(organizationNotificationIds, true);
        if (organizationNotificationsUpdated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon updating organization notifications'));
        }

        return Result.ok(true);
    }

    private async getKeyObjects(organizationId: string, seen: boolean, limit: number, page: number): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;
        
        const organizationNotificationsFound = await this.organizationNotificationRepo.findManyByOrganizationAndSeen(organizationId, seen, limit, page, 'purchase coupon legalInfoRequest');
        if (organizationNotificationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization notifications'));
        }

        const organizationNotifications = organizationNotificationsFound.getValue()!;

        const organizationNotificationsCounted = await this.organizationNotificationRepo.count(
            ['organization', 'seen'],
            [organizationId, seen.toString()]
        );

        if (organizationNotificationsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting organization notifications'));
        }

        const organizationNotificationsCount = organizationNotificationsCounted.getValue()!;

        return Result.ok({
            organization,
            organizationNotifications,
            count: organizationNotificationsCount
        });
    }
}
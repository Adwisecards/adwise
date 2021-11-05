import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationNotificationRepo } from "../../../repo/organizationNotifications/IOrganizationNotificationRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationNotificationValidationService } from "../../../services/organizationNotifications/organizationNotificationValidationService/IOrganizationNotificationValidationService";
import { GetUnseenOrganizationNotificationCountDTO } from "./GetUnseenOrganizationNotificationCountDTO";
import { getUnseenOrganizationNotificationCountErrors } from "./getUnseenOrganizationNotificationCountErrors";

export class GetUnseenOrganizationNotificationCountUseCase implements IUseCase<GetUnseenOrganizationNotificationCountDTO.Request, GetUnseenOrganizationNotificationCountDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private organizationNotificationRepo: IOrganizationNotificationRepo;
    private organizationNotificationValidationService: IOrganizationNotificationValidationService;

    public errors = getUnseenOrganizationNotificationCountErrors;

    constructor(
        organizationRepo: IOrganizationRepo,
        organizationNotificationRepo: IOrganizationNotificationRepo,
        organizationNotificationValidationService: IOrganizationNotificationValidationService
    ) {
        this.organizationRepo = organizationRepo;
        this.organizationNotificationRepo = organizationNotificationRepo;
        this.organizationNotificationValidationService = organizationNotificationValidationService;
    }

    public async execute(req: GetUnseenOrganizationNotificationCountDTO.Request): Promise<GetUnseenOrganizationNotificationCountDTO.Response> {
        const valid = this.organizationNotificationValidationService.getUnseenOrganizationNotificationCountData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
           return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }
        
        const organization = organizationFound.getValue()!;

        if (organization.user.toString() != req.userId) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        const unseenOrganizationNotificationsCounted = await this.organizationNotificationRepo.count(
            ['organization', 'seen'],
            [organization._id.toString(), 'false']
        );

        if (unseenOrganizationNotificationsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting unseen organization notifications'));
        }

        const unseenOrganizationNotificationsCount = unseenOrganizationNotificationsCounted.getValue()!;

        return Result.ok({
            count: unseenOrganizationNotificationsCount
        });
    }
}
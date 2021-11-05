import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { OrganizationNotificationModel } from "../../../models/OrganizationNotification";
import { IOrganizationNotificationRepo } from "../../../repo/organizationNotifications/IOrganizationNotificationRepo";
import { IOrganizationNotificationValidationService } from "../../../services/organizationNotifications/organizationNotificationValidationService/IOrganizationNotificationValidationService";
import { CreateOrganizationNotificationDTO } from "./CreateOrganizationNotificationDTO";
import { createOrganizationNotificationErrors } from "./createOrganizationNotificationErrors";

export class CreateOrganizationNotificationUseCase implements IUseCase<CreateOrganizationNotificationDTO.Request, CreateOrganizationNotificationDTO.Response> {
    private organizationNotificationRepo: IOrganizationNotificationRepo;
    private organizationNotificationValidationService: IOrganizationNotificationValidationService;

    public errors = createOrganizationNotificationErrors;

    constructor(
        organizationNotificationRepo: IOrganizationNotificationRepo,
        organizationNotificationValidationService: IOrganizationNotificationValidationService
    ) {
        this.organizationNotificationRepo = organizationNotificationRepo;
        this.organizationNotificationValidationService = organizationNotificationValidationService;
    }

    public async execute(req: CreateOrganizationNotificationDTO.Request): Promise<CreateOrganizationNotificationDTO.Response> {
        const valid = this.organizationNotificationValidationService.createOrganizationNotificationData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationNotification = new OrganizationNotificationModel({
            organization: req.organizationId,
            type: req.type,
            purchase: req.purchaseId,
            coupon: req.couponId,
            legalInfoRequest: req.legalInfoRequestId
        });

        const organizationNotificationSaved = await this.organizationNotificationRepo.save(organizationNotification);
        if (organizationNotificationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization notification'));
        }

        return Result.ok({organizationNotificationId: organizationNotification._id.toString()});
    }
}
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { INotification } from "../../../models/Notification";
import { INotificationRepo } from "../../../repo/notifications/INotificationRepo";
import { INotificationValidationService } from "../../../services/notifications/notificationValidationService/INotificationValidationService";
import { GetOrganizationNotificationsDTO } from "./GetOrganizationNotificationsDTO";
import { getOrganizationNotificationsErrors } from "./getOrganizationNotificationsErrors";

interface IKeyObjects {
    user: IUser;
    organization: IOrganization;
    notifications: INotification[];
    count: number;
};

export class GetOrganizationNotificationsUseCase implements IUseCase<GetOrganizationNotificationsDTO.Request, GetOrganizationNotificationsDTO.Response> {
    private userRepo: IUserRepo;
    private notificationRepo: INotificationRepo;
    private organizationRepo: IOrganizationRepo;
    private notificationValidationService: INotificationValidationService;

    public errors = getOrganizationNotificationsErrors;

    constructor(
        userRepo: IUserRepo,
        notificationRepo: INotificationRepo,
        organizationRepo: IOrganizationRepo,
        notificationValidationService: INotificationValidationService
    ) {
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
        this.organizationRepo = organizationRepo;
        this.notificationValidationService = notificationValidationService;
    }

    public async execute(req: GetOrganizationNotificationsDTO.Request): Promise<GetOrganizationNotificationsDTO.Response> {
        const valid = this.notificationValidationService.getOrganizationNotificationsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.organizationId, req.search, req.limit, req.page);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            count,
            notifications,
            organization,
            user
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        return Result.ok({
            notifications,
            count
        });
    }

    private async getKeyObjects(userId: string, organizationId: string, search: string, limit: number, page: number): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding user") : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding orgnization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const notificationsFound = await this.notificationRepo.searchManyByOrganization(organization._id.toString(), search, limit, page, 'receivers');
        if (notificationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding notifications'));
        }

        const notifications = notificationsFound.getValue()!;

        const notificationsCounted = await this.notificationRepo.countManyByOrganization(organization._id.toString(), search);
        if (notificationsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting notifications'));
        }

        const count = notificationsCounted.getValue()!;

        return Result.ok({
            notifications,
            organization,
            user,
            count
        });
    }
}
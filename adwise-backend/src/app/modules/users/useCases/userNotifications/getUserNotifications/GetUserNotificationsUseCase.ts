import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUser } from "../../../models/User";
import { IUserNotification } from "../../../models/UserNotification";
import { IUserNotificationRepo } from "../../../repo/userNotifications/IUserNotificationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserNotificationValidationService } from "../../../services/userNotificationValidationService/IUserNotificationValidationService";
import { GetUserNotificationsDTO } from "./GetUserNotificationsDTO";
import { getUserNotificationsErrors } from "./getUserNotificationsErrors";

interface IKeyObjects {
    user: IUser;
    userNotifications: IUserNotification[];
    count: number;
};

export class GetUserNotificationsUseCase implements IUseCase<GetUserNotificationsDTO.Request, GetUserNotificationsDTO.Response> {
    private userRepo: IUserRepo;
    private userNotificationRepo: IUserNotificationRepo;
    private userNotificationValidationService: IUserNotificationValidationService;

    public errors = getUserNotificationsErrors;

    constructor(
        userRepo: IUserRepo,
        userNotificationRepo: IUserNotificationRepo,
        userNotificationValidationService: IUserNotificationValidationService
    ) {
        this.userRepo = userRepo;
        this.userNotificationRepo = userNotificationRepo;
        this.userNotificationValidationService = userNotificationValidationService;
    }

    public async execute(req: GetUserNotificationsDTO.Request): Promise<GetUserNotificationsDTO.Response> {
        const valid = this.userNotificationValidationService.getUserNotificationsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId, req.seen, req.limit, req.page);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            count,
            user,
            userNotifications
        } = keyObjectsGotten.getValue()!;

        const userNotificationIds = userNotifications.map(n => n._id.toString());

        await this.markUserNotificationsAsSeen(userNotificationIds);

        return Result.ok({
            userNotifications,
            count
        });
    }

    private async markUserNotificationsAsSeen(userNotificationIds: string[]): Promise<Result<true | null, UseCaseError | null>> {
        if (!userNotificationIds.length) {
            return Result.ok(true);
        }

        const userNotificationsUpdated = await this.userNotificationRepo.updateManySeenByIds(userNotificationIds, true);
        if (userNotificationsUpdated.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon updating user notifications"));
        }

        return Result.ok(true);
    }

    private async getKeyObjects(userId: string, seen: boolean, limit: number, page: number): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const userNotificationsFound = await this.userNotificationRepo.findManyByUserAndSeen(user._id.toString(), seen, limit, page, 'purchase contact');
        if (userNotificationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user notifications'));
        }

        const userNotifications = userNotificationsFound.getValue()!;

        const userNotificationsCounted = await this.userNotificationRepo.count(
            ['user', 'seen'],
            [user._id.toString(), seen]
        );

        if (userNotificationsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting user notifications'));
        } 

        const count = userNotificationsCounted.getValue()!;

        return Result.ok({
            count,
            user,
            userNotifications
        });
    }
}
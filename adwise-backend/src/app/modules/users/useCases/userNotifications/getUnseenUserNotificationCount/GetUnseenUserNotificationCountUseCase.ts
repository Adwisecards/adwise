import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserNotificationRepo } from "../../../repo/userNotifications/IUserNotificationRepo";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { IUserNotificationValidationService } from "../../../services/userNotificationValidationService/IUserNotificationValidationService";
import { GetUnseenUserNotificationCountDTO } from "./GetUnseenUserNotificationCountDTO";
import { getUnseenUserNotificationCountErrors } from "./getUnseenUserNotificationCountErrors";

export class GetUnseenUserNotificationCountUseCase implements IUseCase<GetUnseenUserNotificationCountDTO.Request, GetUnseenUserNotificationCountDTO.Response> {
    private userRepo: IUserRepo;
    private userNotificationRepo: IUserNotificationRepo;
    private userNotificationValidationService: IUserNotificationValidationService;

    public errors = getUnseenUserNotificationCountErrors;

    constructor(
        userRepo: IUserRepo,
        userNotificationRepo: IUserNotificationRepo,
        userNotificationValidationService: IUserNotificationValidationService
    ) {
        this.userRepo = userRepo;
        this.userNotificationRepo = userNotificationRepo;
        this.userNotificationValidationService = userNotificationValidationService;
    }

    public async execute(req: GetUnseenUserNotificationCountDTO.Request): Promise<GetUnseenUserNotificationCountDTO.Response> {
        const valid = this.userNotificationValidationService.getUnseenUserNotificationCountData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const unseenUserNotificationsCounted = await this.userNotificationRepo.count(
            ['user', 'seen'],
            [user._id.toString(), 'false']
        );

        if (unseenUserNotificationsCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting unseen user notifications'));
        }

        const count = unseenUserNotificationsCounted.getValue()!;

        return Result.ok({count});
    }
}
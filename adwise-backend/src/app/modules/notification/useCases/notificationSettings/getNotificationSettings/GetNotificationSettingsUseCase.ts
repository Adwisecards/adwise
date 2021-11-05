import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationSettings, NotificationSettingsModel } from "../../../models/NotificationSettings";
import { INotificationSettingsRepo } from "../../../repo/notificationSettings/INoitificationSettingsRepo";
import { GetNotificationSettingsDTO } from "./GetNotificationSettingsDTO";
import { getNotificationSettingsErrors } from "./getNotificationSettingsErrors";

export class GetNotificationSettingsUseCase implements IUseCase<GetNotificationSettingsDTO.Request, GetNotificationSettingsDTO.Response> {
    private notificationSettingsRepo: INotificationSettingsRepo;
    
    public errors = getNotificationSettingsErrors;

    constructor(notificationSettingsRepo: INotificationSettingsRepo) {
        this.notificationSettingsRepo = notificationSettingsRepo;
    }

    public async execute(req: GetNotificationSettingsDTO.Request): Promise<GetNotificationSettingsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const notificationSettingsFound = await this.notificationSettingsRepo.findByUser(req.userId);
        if (notificationSettingsFound.isFailure && notificationSettingsFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding notification settings'));
        }

        let notificationSettings: INotificationSettings;

        if (notificationSettingsFound.isFailure && notificationSettingsFound.getError()!.code == 404) {
            notificationSettings = new NotificationSettingsModel({
                user: req.userId
            });

            const notificationSettingsSaved = await this.notificationSettingsRepo.save(notificationSettings);
            if (notificationSettingsSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving notification settings'));
            }
        } else {
            notificationSettings = notificationSettingsFound.getValue()!;
        }

        return Result.ok({notificationSettings});
    }
}
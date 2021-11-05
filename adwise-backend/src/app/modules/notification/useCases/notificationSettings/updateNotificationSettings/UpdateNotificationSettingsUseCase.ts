import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationSettingsRepo } from "../../../repo/notificationSettings/INoitificationSettingsRepo";
import { INotificationSettingsValidationService } from "../../../services/notificationSettings/notificationSettingsValidationService/INotificationSettingsValidationService";
import { GetNotificationSettingsUseCase } from "../getNotificationSettings/GetNotificationSettingsUseCase";
import { UpdateNotificationSettingsDTO } from "./UpdateNotificationSettingsDTO";
import { updateNotificationSettingsErrors } from "./updateNotificationSettingsErrors";

export class UpdateNotificationSettingsUseCase implements IUseCase<UpdateNotificationSettingsDTO.Request, UpdateNotificationSettingsDTO.Response> {
    private notificationSettingsRepo: INotificationSettingsRepo;
    private getNotificationSettingsUseCase: GetNotificationSettingsUseCase;
    private notificationSettingsValidationService: INotificationSettingsValidationService;

    public errors = updateNotificationSettingsErrors;

    constructor(
        notificationSettingsRepo: INotificationSettingsRepo,
        getNotificationSettingsUseCase: GetNotificationSettingsUseCase,
        notificationSettingsValidationService: INotificationSettingsValidationService
    ) {
        this.notificationSettingsRepo = notificationSettingsRepo;
        this.getNotificationSettingsUseCase = getNotificationSettingsUseCase;
        this.notificationSettingsValidationService = notificationSettingsValidationService;
    }

    public async execute(req: UpdateNotificationSettingsDTO.Request): Promise<UpdateNotificationSettingsDTO.Response> {
        if (!Types.ObjectId.isValid(req.userId)) {
            return Result.fail(UseCaseError.create('c', 'userId is not valid'));
        }

        const notificationSettingsGotten = await this.getNotificationSettingsUseCase.execute({
            userId: req.userId
        });

        if (notificationSettingsGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting notification'));
        }

        const { notificationSettings } = notificationSettingsGotten.getValue()!;

        for (const key in req) {
            if ((<any>notificationSettings)[key] != undefined) {
                (<any>notificationSettings)[key] = (<any>req)[key];
            }
        }

        const notificationSettingsSaved = await this.notificationSettingsRepo.save(notificationSettings);
        if (notificationSettingsSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving notification settings'));
        }

        return Result.ok({notificationSettingsId: notificationSettings._id.toString()});
    }
}
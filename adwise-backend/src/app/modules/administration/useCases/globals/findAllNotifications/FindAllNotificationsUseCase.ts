import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { INotificationRepo } from "../../../../notification/repo/notifications/INotificationRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { FindAllNotificationsDTO } from "./FindAllNotificationsDTO";
import { findAllNotificationsErrors } from "./findAllNotificationsErrors";

export class FindAllNotificationsUseCase implements IUseCase<FindAllNotificationsDTO.Request, FindAllNotificationsDTO.Response> {
    private notificationRepo: INotificationRepo;
    private administrationValidationService: IAdministrationValidationService;

    public errors = findAllNotificationsErrors;

    constructor(notificationRepo: INotificationRepo, administrationValidationService: IAdministrationValidationService) {
        this.notificationRepo = notificationRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllNotificationsDTO.Request): Promise<FindAllNotificationsDTO.Response> {
        const valid = await this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber' || key == 'export') continue;
            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        const notificationsFound = await this.notificationRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'receivers receiverGroup organization');
        if (notificationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding notifications'));
        }
        
        const notifications = notificationsFound.getValue()!;

        const countFound = await this.notificationRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({
            count,
            notifications
        });
    }
}
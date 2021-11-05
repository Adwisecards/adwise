import { INotificationValidationService } from "../INotificationValidationService";
import Joi from 'joi';
import NotificationType from "../../../../../../core/static/NotificationType";
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";

export class NotificationValidationService implements INotificationValidationService {
    private schemaForSendNotification = Joi.object().keys({
        app: Joi.string().optional(),
        title: Joi.string().optional(),
        body: Joi.string().optional(),
        type: Joi.string().required().valid(...NotificationType.getList()),
        data: Joi.object().required(),
        values: Joi.object().optional(),
        receiverGroupId: Joi.string().regex(MyRegexp.objectId()),
        receiverIds: Joi.array().items(Joi.string().regex(MyRegexp.objectId())),
        userId: Joi.string().optional().regex(MyRegexp.objectId()),
        asOrganization: Joi.boolean().optional()
    });

    private schemaForGetOrganizationNotifications = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        search: Joi.string().optional(),
        limit: Joi.number().required().min(1),
        page: Joi.number().required().min(1)
    });

    public sendNotificationServiceData<T>(data: T) {
        const {error} = this.schemaForSendNotification.validate(data);
        // debug
        logger.debug('Validating send notification data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationNotificationsData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationNotifications.validate(data);
        // debug
        logger.debug('Validating get organization notifications data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }
}
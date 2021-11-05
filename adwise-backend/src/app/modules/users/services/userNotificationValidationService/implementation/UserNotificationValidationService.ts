import { IUserNotificationValidationService } from "../IUserNotificationValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import UserNotificationType from "../../../../../core/static/UserNotificationType";
import UserNotificationLevel from "../../../../../core/static/UserNotificationLevel";
import { logger } from "../../../../../services/logger";
import { Result } from "../../../../../core/models/Result";

export class UserNotificationValidationService implements IUserNotificationValidationService {
    private schemaForCreateUserNotification = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        type: Joi.string().required().valid(...UserNotificationType.getList()),
        level: Joi.string().required().valid(...UserNotificationLevel.getList()),
        contactId: Joi.string().optional().regex(MyRegexp.objectId()),
        purchaseId: Joi.string().optional().regex(MyRegexp.objectId()),
        organizationId: Joi.string().optional().regex(MyRegexp.objectId())
    });

    private schemaForGetUnseenUserNotificationCount = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetUserNotifications = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        seen: Joi.boolean().required(),
        limit: Joi.number().min(1).required(),
        page: Joi.number().min(1).required()
    });

    public createUserNotificationData<T>(data: T) {
        const {error} = this.schemaForCreateUserNotification.validate(data);
        // debug
        logger.debug('Validating create user notification data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getUnseenUserNotificationCountData<T>(data: T) {
        const {error} = this.schemaForGetUnseenUserNotificationCount.validate(data);
        // debug
        logger.debug('Validating get unseen user notification data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getUserNotificationsData<T>(data: T) {
        const {error} = this.schemaForGetUserNotifications.validate(data);
        // debug
        logger.debug('Validating get unseen user notification data', JSON.stringify(data));
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
import { IOrganizationNotificationValidationService } from "../IOrganizationNotificationValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";
import OrganizationNotificationType from "../../../../../../core/static/OrganizationNotificationType";

export class OrganizationNotificationValidationService implements IOrganizationNotificationValidationService {
    private schemaForGetOrganizationNotifications = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        seen: Joi.boolean().required(),
        limit: Joi.number().required().max(1000).min(1),
        page: Joi.number().required().max(1000).min(1)
    });

    private schemaForCreateOrganizationNotification = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        type: Joi.string().required().valid(...OrganizationNotificationType.getList()),
        purchaseId: Joi.string().regex(MyRegexp.objectId()),
        couponId: Joi.string().regex(MyRegexp.objectId()),
        legalInfoRequestId: Joi.string().regex(MyRegexp.objectId())
    });

    private schemaForGetUnseenOrganizationNotificationCount = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
    });

    public getUnseenOrganizationNotificationCountData<T>(data: T) {
        const {error} = this.schemaForGetUnseenOrganizationNotificationCount.validate(data);
        // debug
        logger.debug('Validating get unseed organization notification count data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createOrganizationNotificationData<T>(data: T) {
        const {error} = this.schemaForCreateOrganizationNotification.validate(data);
        // debug
        logger.debug('Validating create organization notification data', JSON.stringify(data));
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
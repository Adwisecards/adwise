import { INotificationSettingsValidationService } from "../INotificationSettingsValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";

export class NotificationSettingsValidationService implements INotificationSettingsValidationService {
    private schemaForUpdateNotification = Joi.object().keys({
        restrictedOrganizations: Joi.array().items(Joi.string().regex(MyRegexp.objectId())),
        coupon: Joi.boolean(),
        contact: Joi.boolean(),
        ref: Joi.boolean()
    });

    public updateNotificationSettingsData<T>(data: T) {
        const {error} = this.schemaForUpdateNotification.validate(data);
        // debug
        logger.debug('Validating update notification settings data', JSON.stringify(data));
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
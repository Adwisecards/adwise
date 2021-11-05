import Joi from 'joi';
import MyRegexp from 'myregexp';
import { join } from 'path';
import { Result } from '../../../../../core/models/Result';
import LogApp from '../../../../../core/static/LogApp';
import LogPlatform from '../../../../../core/static/LogPlatform';
import { logger } from '../../../../../services/logger';
import { ILogValidationService } from '../ILogValidationService';

export class LogValidationService implements ILogValidationService {
    private schemaForCreateLog = Joi.object().keys({
        platform: Joi.string().required().valid(...LogPlatform.getList()),
        app: Joi.string().required().valid(...LogApp.getList()),
        event: Joi.string().required(),
        isError: Joi.boolean(),
        meta: Joi.object(),
        userId: Joi.string().regex(MyRegexp.objectId()),
        message: Joi.string()
    });

    public createLogData<T>(data: T) {
        const {error} = this.schemaForCreateLog.validate(data);
        // debug
        logger.debug('Validating create log data', JSON.stringify(data));
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
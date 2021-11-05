import { IAdvantageValidationService } from "../IAdvantageValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../services/logger";
import { Result } from "../../../../../core/models/Result";

export class AdvantageValidationService implements IAdvantageValidationService {
    private schemaForCreateAdvantage = Joi.object().keys({
        pictureMediaId: Joi.string().required().regex(MyRegexp.objectId()),
        name: Joi.string().required(),
        index: Joi.number().optional()
    });

    private schemaForDeleteAdvantage = Joi.object().keys({
        advantageId: Joi.string().required().regex(MyRegexp.objectId()),
    });

    private schemaForUpdateAdvantage = Joi.object().keys({
        advantageId: Joi.string().optional().regex(MyRegexp.objectId()),
        pictureMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        name: Joi.string().optional(),
        index: Joi.number().optional()
    });

    public createAdvantageData<T>(data: T) {
        const {error} = this.schemaForCreateAdvantage.validate(data);
        // debug
        logger.debug('Validating create advantage data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public deleteAdvantageData<T>(data: T) {
        const {error} = this.schemaForDeleteAdvantage.validate(data);
        // debug
        logger.debug('Validating delete advantage data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updateAdvantageData<T>(data: T) {
        const {error} = this.schemaForUpdateAdvantage.validate(data);
        // debug
        logger.debug('Validating update advantage data', JSON.stringify(data));
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
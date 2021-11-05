import { IRefValidationService } from "../IRefValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../services/logger";
import { Result } from "../../../../../core/models/Result";

export class RefValidationService implements IRefValidationService {
    private schemaForCreateRef = Joi.object().keys({
        mode: Joi.string().required(),
        type: Joi.string().required(),
        ref: Joi.string().required().regex(MyRegexp.objectId())
    });

    public createRefData<T>(data: T) {
        const {error} = this.schemaForCreateRef.validate(data);
        // debug
        logger.debug('Validating create ref data', JSON.stringify(data));
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
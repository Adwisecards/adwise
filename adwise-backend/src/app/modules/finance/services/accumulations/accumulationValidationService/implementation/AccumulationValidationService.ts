import { IAccumulationValidationService } from "../IAccumulationValidationService";
import Joi from 'joi';
import { Result } from "../../../../../../core/models/Result";
import { logger } from "../../../../../../services/logger";
import MyRegexp from "myregexp";
import AccumulationType from "../../../../../../core/static/AccumulationType";

export class AccumulationValidationService implements IAccumulationValidationService {
    private schemaForCreateAccumulation = Joi.object().keys({
        accumulationId: Joi.string().required(),
        sum: Joi.number().required(),
        type: Joi.string().required().valid(...AccumulationType.getList()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        paymentId: Joi.string().required().regex(MyRegexp.objectId())
    });

    public createAccumulationData<T>(data: T) {
        const {error} = this.schemaForCreateAccumulation.validate(data);
        // debug
        logger.debug('Validating create accumulation data', JSON.stringify(data));
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
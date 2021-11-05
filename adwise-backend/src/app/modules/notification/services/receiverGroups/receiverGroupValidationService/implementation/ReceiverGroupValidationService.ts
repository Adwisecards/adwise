import { IReceiverGroupValidationService } from "../IReceiverGroupValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";
import Gender from "../../../../../../core/static/Gender";

export class ReceiverGroupValidationService implements IReceiverGroupValidationService {
    private schemaForCreateReceiverGroup = Joi.object().keys({
        name: Joi.string().required(),
        parameters: Joi.object().required().keys({
            os: Joi.string(),
            hasPurchase: Joi.boolean(),
            organizations: Joi.array().items(Joi.string().regex(MyRegexp.objectId())),
            gender: Joi.string().valid(...Gender.getList()),
            ageFrom: Joi.number().min(0),
            ageTo: Joi.number().min(0)
        }),
        wantedReceiverIds: Joi.array().optional().items(Joi.string().regex(MyRegexp.objectId()))
    });

    public createReceiverGroupData<T>(data: T) {
        const {error} = this.schemaForCreateReceiverGroup.validate(data);
        // debug
        logger.debug('Validating create receiver group data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }
};
import Joi from 'joi';
import MyRegexp from 'myregexp';
import { Result } from '../../../../../../core/models/Result';
import ChatType from '../../../../../../core/static/ChatType';
import { logger } from '../../../../../../services/logger';
import { IMessageValidationService } from '../IMessageValidationService';

export class MessageValidationService implements IMessageValidationService {
    private schemaForCreateMessage = Joi.object().keys({
        fromUserId: Joi.string().required().regex(MyRegexp.objectId()),
        to: Joi.object().keys({
            id: Joi.string().required().regex(MyRegexp.objectId()),
            type: Joi.string().required().valid(...ChatType.getList())
        }),
        body: Joi.object().keys({
            text: Joi.string().optional(),
            media: Joi.array().items(Joi.string())
        })
    });

    public createMessageData<T>(data: T) {
        const {error} = this.schemaForCreateMessage.validate(data);
        // debug
        logger.debug('Validating create message data', JSON.stringify(data));
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
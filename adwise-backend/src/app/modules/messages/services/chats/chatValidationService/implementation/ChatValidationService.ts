import { IChatValidationService } from "../IChatValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";
import ChatType from "../../../../../../core/static/ChatType";

export class ChatValidationService implements IChatValidationService {
    private createChatSchema = Joi.object().keys({
        fromUserId: Joi.string().required().regex(MyRegexp.objectId()),
        to: Joi.object().keys({
            id: Joi.string().required().regex(MyRegexp.objectId()),
            type: Joi.string().required().valid(...ChatType.getList())
        }).required(),
        asOrganization: Joi.boolean().optional()
    });

    public createChatData<T>(data: T) {
        const {error} = this.createChatSchema.validate(data);
        // debug
        logger.debug('Validating create chat data', JSON.stringify(data));
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
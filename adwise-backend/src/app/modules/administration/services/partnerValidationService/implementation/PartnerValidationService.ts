import { IPartnerValidationService } from "../IPartnerValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { Result } from "../../../../../core/models/Result";
import { logger } from "../../../../../services/logger";

export class PartnerValidationService implements IPartnerValidationService {
    private schemaForCreatePartner = Joi.object().keys({
        index: Joi.number().optional(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        pictureMediaId: Joi.string().required().regex(MyRegexp.objectId()),
        presentationUrl: Joi.string().optional().regex(MyRegexp.url())
    });

    private schemaForDeletePartner = Joi.object().keys({
        partnerId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForUpdatePartner = Joi.object().keys({
        partnerId: Joi.string().optional().regex(MyRegexp.objectId()),
        index: Joi.number().optional(),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        pictureMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        presentationUrl: Joi.string().optional().regex(MyRegexp.url())
    });

    public createPartnerData<T>(data: T) {
        const {error} = this.schemaForCreatePartner.validate(data);
        // debug
        logger.debug('Validating create partner data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public deletePartnerData<T>(data: T) {
        const {error} = this.schemaForDeletePartner.validate(data);
        // debug
        logger.debug('Validating delete partner data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updatePartnerData<T>(data: T) {
        const {error} = this.schemaForUpdatePartner.validate(data);
        // debug
        logger.debug('Validating update partner data', JSON.stringify(data));
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
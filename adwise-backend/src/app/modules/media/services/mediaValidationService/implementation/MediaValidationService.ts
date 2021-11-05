import { IMediaValidationService } from "../IMediaValidationService";
import Joi from 'joi';
import MediaType from "../../../../../core/static/MediaType";
import { logger } from "../../../../../services/logger";
import { Result } from "../../../../../core/models/Result";
import MimeType from "../../../../../core/static/MimeTypes";
import MyRegexp from "myregexp";

export class MediaValidationService implements IMediaValidationService {
    private schemaForCreateMedia = Joi.object().keys({
        data: Joi.any().required(),
        type: Joi.string().required().valid(...MediaType.getList()),
        mimeType: Joi.string().required().valid(...MimeType.getList())
    });

    private schemaForGetMediaData = Joi.object().keys({
        mediaId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetMedia = Joi.object().keys({
        mediaId: Joi.string().required().regex(MyRegexp.objectId())
    });

    public getMediaData<T>(data: T) {
        const {error} = this.schemaForGetMedia.validate(data);
        // debug
        logger.debug('Validating get media data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createMediaData<T>(data: T) {
        const {error} = this.schemaForCreateMedia.validate(data);
        // debug
        logger.debug('Validating create media data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getMediaDataData<T>(data: T) {
        const {error} = this.schemaForGetMediaData.validate(data);
        // debug
        logger.debug('Validating get media data data', JSON.stringify(data));
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
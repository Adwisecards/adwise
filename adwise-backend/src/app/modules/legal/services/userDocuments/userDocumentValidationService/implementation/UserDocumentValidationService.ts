import { IUserDocumentValidationService } from "../IUserDocumentValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import UserDocumentType from "../../../../../../core/static/UserDocumentType";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";

export class UserDocumentValidationService implements IUserDocumentValidationService {
    private schemaForGenerateUserDocument = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        type: Joi.string().required().valid(...UserDocumentType.getList())
    });

    private schemaForGetUserDocuments = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        type: Joi.string().optional().valid(...UserDocumentType.getList())
    });

    public generateUserDocumentData<T>(data: T) {
        const {error} = this.schemaForGenerateUserDocument.validate(data);
        // debug
        logger.debug('Validating generate user document data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getUserDocumentsData<T>(data: T) {
        const {error} = this.schemaForGetUserDocuments.validate(data);
        // debug
        logger.debug('Validating get user documents data', JSON.stringify(data));
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
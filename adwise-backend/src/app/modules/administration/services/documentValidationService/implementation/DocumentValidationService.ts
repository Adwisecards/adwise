import { IDocumentValidationService } from "../IDocumentValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../services/logger";
import { Result } from "../../../../../core/models/Result";
import DocumentType from "../../../../../core/static/DocumentType";
import { Document } from "mongoose";

export class DocumentValidationService implements IDocumentValidationService {
    private schemaForCreateDocument = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        fileMediaId: Joi.string().required().regex(MyRegexp.objectId()),
        type: Joi.string().required().valid(...DocumentType.getList()),
        index: Joi.number().optional()
    });

    private schemaForDeleteDocument = Joi.object().keys({
        documentId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForUpdateDocument = Joi.object().keys({
        documentId: Joi.string().required().regex(MyRegexp.objectId()),
        name: Joi.string().optional(),
        description: Joi.string().optional(),
        fileMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        type: Joi.string().optional().valid(...DocumentType.getList()),
        index: Joi.number().optional()
    });

    private schemaForGetDocumentByType = Joi.object().keys({
        type: Joi.string().required().valid(...DocumentType.getList())
    });

    public createDocumentData<T>(data: T) {
        const {error} = this.schemaForCreateDocument.validate(data);
        // debug
        logger.debug('Validating create document data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public deleteDocumentData<T>(data: T) {
        const {error} = this.schemaForDeleteDocument.validate(data);
        // debug
        logger.debug('Validating delete document data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updateDocumentData<T>(data: T) {
        const {error} = this.schemaForUpdateDocument.validate(data);
        // debug
        logger.debug('Validating update document data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getDocumentsByTypeData<T>(data: T) {
        const {error} = this.schemaForGetDocumentByType.validate(data);
        // debug
        logger.debug('Validating get documents by type data', JSON.stringify(data));
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
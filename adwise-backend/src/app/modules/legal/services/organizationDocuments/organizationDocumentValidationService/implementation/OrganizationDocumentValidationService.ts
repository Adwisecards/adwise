import { IOrganizationDocumentValidationService } from "../IOrganizationDocumentValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import OrganizationDocumentType from "../../../../../../core/static/OrganizationDocumentType";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";

export class OrganizationDocumentValidationService implements IOrganizationDocumentValidationService {
    private schemaForGenerateOrganizationDocument = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        type: Joi.string().required().valid(...OrganizationDocumentType.getList()),
        options: Joi.object().keys({
            dateFrom: Joi.date().iso().optional(),
            dateTo: Joi.date().iso().optional()
        }).optional(),
        asNew: Joi.boolean().optional()
    });

    private schemaForGetOrganizationDocuments = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        // userId: Joi.string().required().regex(MyRegexp.objectId()),
        type: Joi.string().optional().valid(...OrganizationDocumentType.getList())
    });

    private schemaForGetOrganizationDocument = Joi.object().keys({
        organizationDocumentId: Joi.string().required().regex(MyRegexp.objectId())
    });

    public generateOrganizationDocumentData<T>(data: T) {
        const {error} = this.schemaForGenerateOrganizationDocument.validate(data);
        // debug
        logger.debug('Validating generate organization document data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationDocumentsData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationDocuments.validate(data);
        // debug
        logger.debug('Validating get organization documents data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationDocumentData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationDocument.validate(data);
        // debug
        logger.debug('Validating get organization document data', JSON.stringify(data));
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
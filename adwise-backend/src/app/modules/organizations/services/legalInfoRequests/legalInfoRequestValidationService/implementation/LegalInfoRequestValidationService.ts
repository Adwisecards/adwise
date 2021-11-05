import { ILegalInfoRequestValidationService } from "../ILegalInfoRequestValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { Result } from "../../../../../../core/models/Result";
import { logger } from "../../../../../../services/logger";

export class LegalInfoRequestValidationService implements ILegalInfoRequestValidationService {
    private schemaForCreateLegalInfoRequest = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        addressId: Joi.string().optional().regex(MyRegexp.objectId()),
        name: Joi.string().optional(),
        categoryId: Joi.string().optional().regex(MyRegexp.objectId()),
        phones: Joi.array().items(Joi.string().regex(MyRegexp.phone())).min(0),
        emails: Joi.array().items(Joi.string().regex(MyRegexp.email())).min(0),
        legalId: Joi.string().optional().regex(MyRegexp.objectId()),
        comment: Joi.string().required()
    });

    private schemaForRejectLegalInfoRequest = Joi.object().keys({
        legalInfoRequestId: Joi.string().required().regex(MyRegexp.objectId()),
        rejectionReason: Joi.string().required()
    });

    public rejectLegalInfoRequestData<T>(data: T) {
        const {error} = this.schemaForRejectLegalInfoRequest.validate(data);
        // debug
        logger.debug('Validating reject legal info data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createLegalInfoRequestData<T>(data: T) {
        const {error} = this.schemaForCreateLegalInfoRequest.validate(data);
        // debug
        logger.debug('Validating create legal info data', JSON.stringify(data));
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
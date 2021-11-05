import { IAddressValidationService } from "../IAddressValidationService";
import Joi from 'joi';
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";
import Language from "../../../../../../core/static/Language";

export class AddressValidationService implements IAddressValidationService {
    private schemaForCreateAddressFromCoords = Joi.object().keys({
        lat: Joi.number().required(),
        long: Joi.number().required(),
        details: Joi.string().optional(),
        language: Joi.string().optional().valid(...Language.getList())
    });

    private schemaForAddressDetails = Joi.object().keys({
        region: Joi.string().optional().allow(''),
        country: Joi.string().required(),
        city: Joi.string().required(),
        address: Joi.string().required(),
        coords: Joi.array().required().items(Joi.number()).length(2)
    }).unknown(true);

    public createAddressFromCoordsData<T>(data: T) {
        const {error} = this.schemaForCreateAddressFromCoords.validate(data);
        // debug
        logger.debug('Validating create address from coords data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public addressDetailsData<T>(data: T) {
        const {error} = this.schemaForAddressDetails.validate(data);
        // debug
        logger.debug('Validating address details data', JSON.stringify(data));
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
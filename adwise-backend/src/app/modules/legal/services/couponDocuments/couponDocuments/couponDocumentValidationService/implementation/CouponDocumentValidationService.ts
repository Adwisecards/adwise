import { ICouponDocumentValidationService } from "../ICouponDocumentValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../../services/logger";
import { Result } from "../../../../../../../core/models/Result";
import CouponDocumentType from "../../../../../../../core/static/CouponDocumentType";

export class CouponDocumentValidationService implements ICouponDocumentValidationService {
    private schemaForGetCouponDocuments = Joi.object().keys({
        couponId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGenerateCouponDocuments = Joi.object().keys({
        couponId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        type: Joi.string().required().valid(...CouponDocumentType.getList())
    });

    public getCouponDocumentsData<T>(data: T) {
        const {error} = this.schemaForGetCouponDocuments.validate(data);
        // debug
        logger.debug('Validating get coupon documents data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public generateCouponDocumentData<T>(data: T) {
        const {error} = this.schemaForGenerateCouponDocuments.validate(data);
        // debug
        logger.debug('Validating generate coupon document data', JSON.stringify(data));
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
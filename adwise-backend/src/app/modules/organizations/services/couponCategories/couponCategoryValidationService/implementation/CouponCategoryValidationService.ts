import { ICouponCategoryValidationService } from "../ICouponCategoryValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";

export class CouponCategoryValidationService implements ICouponCategoryValidationService {
    private schemaForCreateCouponCategory = Joi.object().keys({
        name: Joi.string().required(),
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetOrganizationCouponCategories = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        disabled: Joi.boolean().optional()
    });

    private schemaForSetCouponCategoryDisabled = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        couponCategoryId: Joi.string().required().regex(MyRegexp.objectId()),
        disabled: Joi.boolean().required()
    });

    public createCouponCategoryData<T>(data: T) {
        const {error} = this.schemaForCreateCouponCategory.validate(data);
        // debug
        logger.debug('Validating create coupon category data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationCouponCategoriesData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationCouponCategories.validate(data);
        // debug
        logger.debug('Validating get organization coupon categories data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public setCouponCategoryDisabledData<T>(data: T) {
        const {error} = this.schemaForSetCouponCategoryDisabled.validate(data);
        // debug
        logger.debug('Validating set coupon category disabled data', JSON.stringify(data));
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
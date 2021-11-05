import { ILogger } from "../../../../../../services/logger/ILogger";
import { ICouponValidationService } from "../ICouponValidationService";
import Joi, { string } from 'joi';
import MyRegexp from "myregexp";
import OfferType from "../../../../../../core/static/OfferType";
import { Result } from "../../../../../../core/models/Result";
import CouponType from "../../../../../../core/static/CouponType";
import AgeRestricted from "../../../../../../core/static/AgeRestricted";

export class CouponValidationService implements ICouponValidationService {
    private schemaForCreateCoupon = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        offerType: Joi.string().required().valid(...OfferType.getList()),
        offerPercent: Joi.number().min(0).max(100),
        offerPoints: Joi.number().min(0),
        quantity: Joi.number().min(1).required(),
        distributionSchema: Joi.object().keys({
            first: Joi.number().min(0).max(100).required(),
            other: Joi.number().min(0).max(100).required()
        }).required(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        price: Joi.number().min(0).required(),
        locationAddressId: Joi.string().required().regex(MyRegexp.objectId()),
        index: Joi.number().min(0),
        type: Joi.string().valid(...CouponType.getList()).required(),
        pictureMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        documentMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        termsDocumentMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        ageRestricted: Joi.string().optional().valid(...AgeRestricted.getList()),
        couponCategoryIds: Joi.array().items(Joi.string().regex(MyRegexp.objectId())).optional(),
        floating: Joi.boolean().optional(),
        disabled: Joi.boolean().optional()
    }).xor('offerPercent', 'offerPoints').min(1);

    private schemaForFindCoupons = Joi.object().keys({
        limit: Joi.number().required().min(1),
        page: Joi.number().required().min(1),
        search: Joi.string().optional(),
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetUserCoupons = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        sortBy: Joi.string().optional().valid('quantity', 'disabled', 'endDate', 'price', 'cashback'),
        order: Joi.number().optional().valid(-1, 1)
    });

    private schemaForSetCouponCategories = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        couponId: Joi.string().required().regex(MyRegexp.objectId()),
        couponCategoryIds: Joi.array().items(Joi.string().regex(MyRegexp.objectId())).optional(),
    });
    
    private logger: ILogger;
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public createCouponData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForCreateCoupon.validate(data);
        // debug
        this.logger.debug('Validating create coupon data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public findCouponsData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForFindCoupons.validate(data);
        // debug
        this.logger.debug('Validating find coupons data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getUserCouponsData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForGetUserCoupons.validate(data);
        // debug
        this.logger.debug('Validating get user coupons data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public setCouponCategoriesData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForSetCouponCategories.validate(data);
        // debug
        this.logger.debug('Validating set coupon categories data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }
}
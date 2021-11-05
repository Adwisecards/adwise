import { ILogger } from "../../../../../../services/logger/ILogger";
import { IPurchaseValidationService } from "../IPurchaseValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { Result } from "../../../../../../core/models/Result";

export class PurchaseValidationService implements IPurchaseValidationService {
    private logger: ILogger;
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    private schemaForCreatePurchaseForClients = Joi.object().keys({
        purchaserContactIds: Joi.array().items(Joi.string().optional().regex(MyRegexp.objectId())).required().min(1),
        coupons: Joi.array().min(1).items(Joi.object().keys({
            count: Joi.number().required().min(1),
            couponId: Joi.string().required().regex(MyRegexp.objectId()),
            price: Joi.number().optional().min(0)
        })),
        cashierContactId: Joi.string().optional().regex(MyRegexp.objectId()),
        description: Joi.string().required(),
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForCreatePurchase = Joi.object().keys({
        purchaserContactId: Joi.string().optional().regex(MyRegexp.objectId()),
        coupons: Joi.array().min(1).items(Joi.object().keys({
            count: Joi.number().required().min(1),
            couponId: Joi.string().required().regex(MyRegexp.objectId()),
            price: Joi.number().optional().min(0)
        })),
        cashierContactId: Joi.string().optional().regex(MyRegexp.objectId()),
        description: Joi.string().required(),
        asOrganization: Joi.boolean().optional(),
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForFindUserPurchases = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        limit: Joi.number().min(0).required(),
        page: Joi.number().min(0).required(),
        multiple: Joi.boolean().optional(),
        types: Joi.array().items(Joi.string().valid('confirmed', 'shared', 'new', 'processing', 'complete', 'archived')).optional(),
        dateFrom: Joi.date().optional().iso(),
        dateTo: Joi.date().optional().iso(),
        refCode: Joi.string().optional(),
        organizationName: Joi.string().optional()
    });

    private schemaForAddReviewToPurchaseData = Joi.object().keys({
        purchaseId: Joi.string().required().regex(MyRegexp.objectId()),
        review: Joi.string().optional().allow(''),
        rating: Joi.number().optional()
    });

    private schemaForConfirmPurchaseData = Joi.object().keys({
        purchaseId: Joi.string().required().regex(MyRegexp.objectId()),
        cash: Joi.boolean().optional(),
        split: Joi.boolean().optional(),
        safe: Joi.boolean().optional(),
        resolvedObjects: Joi.object().optional()
    });

    private schemaForCalculatePurchaseMarketing = Joi.object().keys({
        purchase: Joi.object().required()
    });

    private schemaForSharePurchase = Joi.object().keys({
        purchaseId: Joi.string().required().regex(MyRegexp.objectId()),
        receiverContactId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetPurchase = Joi.object().keys({
        purchaseId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        multiple: Joi.boolean().optional(),
    });

    private schemaForPayPurchase = Joi.object().keys({
        purchaseId: Joi.string().required().regex(MyRegexp.objectId()),
        usedPoints: Joi.number().required().min(0),
        comment: Joi.string().optional().allow('')
    });

    private schemaForSetPurchaseArchived = Joi.object().keys({
        purchaseId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        archived: Joi.boolean().required()
    });

    public getPurchaseData<T>(data: T) {
        const {error} = this.schemaForGetPurchase.validate(data);
        // debug
        this.logger.debug('Validating get purchase data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public setPurchaseArchivedData<T>(data: T) {
        const {error} = this.schemaForSetPurchaseArchived.validate(data);
        // debug
        this.logger.debug('Validating set purchase archived data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createPurchaseData<T>(data: T) {
        const {error} = this.schemaForCreatePurchase.validate(data);
        // debug
        this.logger.debug('Validating create purchase data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public sharePurchaseData<T>(data: T) {
        const {error} = this.schemaForSharePurchase.validate(data);
        // debug
        this.logger.debug('Validating share purchase data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createPurchaseForClientsData<T>(data: T) {
        const {error} = this.schemaForCreatePurchaseForClients.validate(data);
        // debug
        this.logger.debug('Validating create purchase for clients data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public addReviewToPurchaseData<T>(data: T) {
        const {error} = this.schemaForAddReviewToPurchaseData.validate(data);
        // debug
        this.logger.debug('Validating add review to purchase data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public findUserPurchasesData<T>(data: T) {
        const {error} = this.schemaForFindUserPurchases.validate(data);
        // debug
        this.logger.debug('Validating find user purchases data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public confirmPurchaseData<T>(data: T) {
        const {error} = this.schemaForConfirmPurchaseData.validate(data);
        // debug
        this.logger.debug('Validating confirm purchase data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public calculatePurchaseMarketingData<T>(data: T) {
        const {error} = this.schemaForCalculatePurchaseMarketing.validate(data);
        // debug
        this.logger.debug('Validating confirm purchase data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public payPurchaseData<T>(data: T) {
        const {error} = this.schemaForPayPurchase.validate(data);
        // debug
        this.logger.debug('Validating pay purchase data', JSON.stringify(data));
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
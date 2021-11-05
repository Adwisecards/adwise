import { ISubscriptionValidationService } from "../ISubscriptionValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { ILogger } from "../../../../../../services/logger/ILogger";
import { Result } from "../../../../../../core/models/Result";

export class SubscriptionValidationService implements ISubscriptionValidationService {
    private schemaForCreateSubscription = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        invitation: Joi.any().optional(),
        organizationId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForCalculateRefPayments = Joi.object().keys({
        purchase: Joi.object().required()
    });

    private schemaForDistributeToSubscriptions = Joi.object().keys({
        refPayments: Joi.array().required().items(Joi.object().keys({
            subscription: Joi.object().required(),
            sum: Joi.number().required().min(0),
            purchase: Joi.any().required(),
            coupon: Joi.any(),
            index: Joi.number().required()
        })),
        split: Joi.boolean().optional(),
        safe: Joi.boolean().optional(),
        cash: Joi.boolean().optional()
    });

    private schemaForChangeParent = Joi.object().keys({
        subscriptionId: Joi.string().required().regex(MyRegexp.objectId()),
        parentId: Joi.string().required().regex(MyRegexp.objectId()),
        reason: Joi.string().optional()
    });

    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public createSubscriptionData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForCreateSubscription.validate(data);
        // debug
        this.logger.debug('Validating create subscription data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);

            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public changeParentData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForChangeParent.validate(data);
        // debug
        this.logger.debug('Validating change parent data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);

            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public calculateRefPaymentsData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForCalculateRefPayments.validate(data);
        // debug
        this.logger.debug('Validating calculate ref payments data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);

            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public distributeToSubscriptionsData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForDistributeToSubscriptions.validate(data);
        // debug
        this.logger.debug('Validating schema ref payments data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);

            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }
};
import { ITipsValidationService } from "../ITipsValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { ILogger } from "../../../../../../services/logger/ILogger";
import { Result } from "../../../../../../core/models/Result";

export class TipsValidationService implements ITipsValidationService {
    private schemaForSendTips = Joi.object().keys({
        userId: Joi.string().optional().regex(MyRegexp.objectId()).allow(''),
        cashierUserId: Joi.string().required().regex(MyRegexp.objectId()),
        sum: Joi.number().required().min(0),
        purchaseId: Joi.string().regex(MyRegexp.objectId()).optional().allow('')
    });

    private schemaForGetCashierTips= Joi.object().keys({
        cashierContactId: Joi.string().required().regex(MyRegexp.objectId()),
        page: Joi.number().required().min(1),
        limit: Joi.number().required().min(1),
        all: Joi.boolean().required()
    });

    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public sendTipsData<T>(data: T) {
        const {error} = this.schemaForSendTips.validate(data);
        // debug
        this.logger.debug('Validating send tips data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getCashierTipsData<T>(data: T) {
        const {error} = this.schemaForGetCashierTips.validate(data);
        // debug
        this.logger.debug('Validating get cashier tips data', JSON.stringify(data));
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
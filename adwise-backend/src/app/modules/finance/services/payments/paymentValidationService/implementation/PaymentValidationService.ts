import Joi from 'joi';
import PaymentType from "../../../../../../core/static/PaymentType";
import Currency from "../../../../../../core/static/Currency";
import MyRegexp from "myregexp";
import { ILogger } from "../../../../../../services/logger/ILogger";
import { Result } from "../../../../../../core/models/Result";
import { IPaymentValidationService } from "../IPaymentValidationService";

export class PaymentValidationService implements IPaymentValidationService {
    private logger: ILogger;
    private schemaForCreatePayment = Joi.object().keys({
        type: Joi.string().required().valid(...PaymentType.getList()),
        sum: Joi.number().required().min(0),
        currency: Joi.string().required().valid(...Currency.getList()),
        ref: Joi.string().required().regex(MyRegexp.objectId()),
        usedPoints: Joi.number().min(0),
        shopId: Joi.string().optional().allow(''),
        safe: Joi.boolean().optional()
    });

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public createPaymentData<T>(data: T) {
        const {error} = this.schemaForCreatePayment.validate(data);
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
}
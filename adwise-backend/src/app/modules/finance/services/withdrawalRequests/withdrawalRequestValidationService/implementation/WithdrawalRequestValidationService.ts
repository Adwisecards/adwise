import { ILogger } from "../../../../../../services/logger/ILogger";
import { IWithdrawalRequestValidationService } from "../IWithdrawalRequestValidationService";
import * as Joi from 'joi';
import MyRegexp from "myregexp";
import Currency from "../../../../../../core/static/Currency";
import { Result } from "../../../../../../core/models/Result";

export class WithdrawalRequestValidationService implements IWithdrawalRequestValidationService {
    private logger: ILogger;
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    private schemaForCreateLegalWithdrawalRequest = Joi.object().keys({
        userId: Joi.string().optional().regex(MyRegexp.objectId()),
        walletId: Joi.string().required().regex(MyRegexp.objectId()),
        sum: Joi.number().required().min(1),
        comment: Joi.string().optional().allow(''),
        timestamp: Joi.date().iso().optional()
    });

    private schemaForUpdateWithdrawalRequest = Joi.object().keys({
        sum: Joi.number().min(1),
        comment: Joi.string().optional().allow(''),
        timestamp: Joi.date().iso().optional(),
        withdrawalRequestId: Joi.string().required().regex(MyRegexp.objectId())
    });

    public updateWithdrawalRequestData<T>(data: T) {
        const {error} = this.schemaForUpdateWithdrawalRequest.validate(data);
        // debug
        this.logger.debug('Validating update withdrawal request data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createLegalWithdrawalRequestData<T>(data: T) {
        const {error} = this.schemaForCreateLegalWithdrawalRequest.validate(data);
        // debug
        this.logger.debug('Validating create legal withdrawal request data', JSON.stringify(data));
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
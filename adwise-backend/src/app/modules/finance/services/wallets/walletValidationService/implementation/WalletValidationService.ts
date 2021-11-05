import { IWalletValidationService } from "../IWalletValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";
import Currency from "../../../../../../core/static/Currency";

export class WalletValidationService implements IWalletValidationService {
    private schemaForCreateWallet = Joi.object().keys({
        currency: Joi.string().required().valid(...Currency.getList()),
        userId: Joi.string().optional().regex(MyRegexp.objectId()),
        organizationId: Joi.string().optional().regex(MyRegexp.objectId())
    });

    private schemaForGetWalletBalance = Joi.object().keys({
        walletId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForSetWalletDeposit = Joi.object().keys({
        walletId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        deposit: Joi.number().required(),
        isAdmin: Joi.boolean().required()
    });

    public createWalletData<T>(data: T) {
        const { error } = this.schemaForCreateWallet.validate(data);
        // debug
        logger.debug('Validating create wallet data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getWalletBalanceData<T>(data: T) {
        const { error } = this.schemaForGetWalletBalance.validate(data);
        // debug
        logger.debug('Validating get wallet balance data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public setWalletDepositData<T>(data: T) {
        const { error } = this.schemaForSetWalletDeposit.validate(data);
        // debug
        logger.debug('Validating set wallet deposit data', JSON.stringify(data));
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
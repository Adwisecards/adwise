import { ITransactionValidationService } from "../ITransactionValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";

export class TransactionValidationService implements ITransactionValidationService {
    private schemaForAddCommentToTransaction = Joi.object().keys({
        transactionId: Joi.string().required().regex(MyRegexp.objectId()),
        comment: Joi.string().required().allow('')
    });

    public addCommentToTransactionData<T>(data: T) {
        const { error } = this.schemaForAddCommentToTransaction.validate(data);
        // debug
        logger.debug('Validating add comment to transaction data', JSON.stringify(data));
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
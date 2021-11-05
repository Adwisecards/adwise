import { IQuestionValidationService } from "../IQuestionValidationService";
import Joi from 'joi';
import QuestionType from "../../../../../core/static/QuestionType";
import MyRegexp from "myregexp";
import { logger } from "../../../../../services/logger";
import { Result } from "../../../../../core/models/Result";

export class QuestionValidationService implements IQuestionValidationService {
    private schemaForCreateQuestion = Joi.object().keys({
        type: Joi.string().required().valid(...QuestionType.getList()),
        categoryId: Joi.string().required().regex(MyRegexp.objectId()),
        question: Joi.string().required(),
        answer: Joi.string().required()
    });

    private schemaForUpdateQuestion = Joi.object().keys({
        type: Joi.string().required().valid(...QuestionType.getList()),
        categoryId: Joi.string().required().regex(MyRegexp.objectId()),
        question: Joi.string().required(),
        answer: Joi.string().required(),
        questionId: Joi.string().required().regex(MyRegexp.objectId())
    });

    public createQuestionData<T>(data: T) {
        const {error} = this.schemaForCreateQuestion.validate(data);
        // debug
        logger.debug('Validating create version data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updateQuestionData<T>(data: T) {
        const {error} = this.schemaForUpdateQuestion.validate(data);
        // debug
        logger.debug('Validating update version data', JSON.stringify(data));
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
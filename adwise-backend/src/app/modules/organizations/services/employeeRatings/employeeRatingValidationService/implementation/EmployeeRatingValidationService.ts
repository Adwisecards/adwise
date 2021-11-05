import { IEmployeeRatingValidationService } from "../IEmployeeRatingValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { ILogger } from "../../../../../../services/logger/ILogger";
import { Result } from "../../../../../../core/models/Result";

export class EmployeeRatingValidationService implements IEmployeeRatingValidationService {
    private schemaForCreateEmployeeRating = Joi.object().keys({
        employeeContactId: Joi.string().required().regex(MyRegexp.objectId()),
        purchaserContactId: Joi.string().optional().regex(MyRegexp.objectId()).allow(''),
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().optional().allow(''),
        purchaseId: Joi.string().optional().regex(MyRegexp.objectId()),
        purchaserUserId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetEmployeeRating = Joi.object().keys({
        employeeRatingId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetEmployeeRatings = Joi.object().keys({
        employeeId: Joi.string().required().regex(MyRegexp.objectId()),
        limit: Joi.number().optional().min(1),
        page: Joi.number().optional().min(1)
    });

    private logger: ILogger;
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public createEmployeeRatingData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForCreateEmployeeRating.validate(data);
        // debug
        this.logger.debug('Validating create employee rating data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getEmployeeRatingData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForGetEmployeeRating.validate(data);
        // debug
        this.logger.debug('Validating get employee rating data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getEmployeeRatingsData<T>(data: T): Result<string | null, string | null> {
        const {error} = this.schemaForGetEmployeeRatings.validate(data);
        // debug
        this.logger.debug('Validating get employee ratings data', JSON.stringify(data));
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
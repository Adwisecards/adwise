import { IEmployeeValidationService } from "../IEmployeeValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";

export class EmployeeValidationService implements IEmployeeValidationService {
    private schemaForGetEmployee = Joi.object().keys({
        employeeId: Joi.string().required().regex(MyRegexp.objectId())
    });

    public getEmployeeData<T>(data: T) {
        const { error } = this.schemaForGetEmployee.validate(data);
        // debug
        logger.debug('Validating get employee data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }
};
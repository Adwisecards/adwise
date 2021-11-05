import { ITaskValidationService } from "../ITaskValidationService";

import Joi from 'joi';
import MyRegexp from "myregexp";
import { ILogger } from "../../../../../services/logger/ILogger";
import { Result } from "../../../../../core/models/Result";

export class TaskValidationService implements ITaskValidationService {
    private schemaForCreateTask = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        date: Joi.date().iso().required(),
        time: Joi.string().min(5).max(5).required(),
        participants: Joi.array().items(Joi.string().regex(MyRegexp.objectId())).required()
    });

    private logger: ILogger;
    
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public createTaskData<T>(data: T) {
        const {error} = this.schemaForCreateTask.validate(data);
        // debug
        this.logger.debug('Validating create task data', JSON.stringify(data));
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
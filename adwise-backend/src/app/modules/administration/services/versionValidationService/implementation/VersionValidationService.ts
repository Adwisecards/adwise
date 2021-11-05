import { IVersionValidationService } from "../IVersionValidationService";
import Joi from 'joi';
import VersionType from "../../../../../core/static/VersionType";
import { ILogger } from "../../../../../services/logger/ILogger";
import { Result } from "../../../../../core/models/Result";
import MyRegexp from "myregexp";

export class VersionValidationService implements IVersionValidationService {
    private schemaForCreateVersion = Joi.object().keys({
        title: Joi.string().required(),
        version: Joi.string().required(),
        comment: Joi.string().required(),
        date: Joi.date().iso().required(),
        type: Joi.string().required().valid(...VersionType.getList())
    });

    private schemaForUpdateVersion = Joi.object().keys({
        versionId: Joi.string().required().regex(MyRegexp.objectId()),
        title: Joi.string(),
        version: Joi.string(),
        comment: Joi.string(),
        date: Joi.date().iso(),
        type: Joi.string().valid(...VersionType.getList())
    });

    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public updateVersionData<T>(data: T) {
        const {error} = this.schemaForUpdateVersion.validate(data);
        // debug
        this.logger.debug('Validating update version data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createVersionData<T>(data: T) {
        const {error} = this.schemaForCreateVersion.validate(data);
        // debug
        this.logger.debug('Validating create version data', JSON.stringify(data));
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
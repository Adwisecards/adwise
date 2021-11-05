import { IContactValidationService } from "../IContactValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import ContactType from "../../../../../core/static/ContactType";
import { ILogger } from "../../../../../services/logger/ILogger";
import { Result } from "../../../../../core/models/Result";

export class ContactValidationService implements IContactValidationService {
    private logger: ILogger;

    constructor(logger: ILogger) {
        this.logger = logger;
    }

    private createContactSchema = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        firstName: Joi.string(),
        lastName: Joi.string(),
        phone: Joi.string().regex(MyRegexp.phone()),
        email: Joi.string().regex(MyRegexp.email()),
        description: Joi.string(),
        insta: Joi.string().regex(MyRegexp.url()),
        fb: Joi.string().regex(MyRegexp.url()),
        vk: Joi.string().regex(MyRegexp.url()),
        activity: Joi.string(),
        website: Joi.string().regex(MyRegexp.url()),
        type: Joi.string().valid(...ContactType.getList()),
        pictureFile: Joi.any(),
        color: Joi.string(),
        pictureMediaId: Joi.string().optional().regex(MyRegexp.objectId())
    });

    private updateContactSchema = Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string().allow(''),
        phone: Joi.string().regex(MyRegexp.phone()).allow(''),
        email: Joi.string().regex(MyRegexp.email()).allow(''),
        description: Joi.string().allow(''),
        insta: Joi.string().regex(MyRegexp.url()).allow(''),
        fb: Joi.string().regex(MyRegexp.url()).allow(''),
        vk: Joi.string().regex(MyRegexp.url()).allow(''),
        activity: Joi.string().allow(''),
        website: Joi.string().regex(MyRegexp.url()).allow(''),
        pictureFile: Joi.any(),
        color: Joi.string(),
        tipsMessage: Joi.string(),
        pictureMediaId: Joi.string().optional().regex(MyRegexp.objectId())
    });

    private schemaForFindContacts = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        limit: Joi.number().required().min(1),
        page: Joi.number().required().min(1)
    });

    public createContactData<T>(data: T) {
        const {error} = this.createContactSchema.validate(data);
        // debug
        this.logger.debug('Validating create contact data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updateContactData<T>(data: T) {
        const {error} = this.updateContactSchema.validate(data);
        // debug
        this.logger.debug('Validating update contact data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public findContactsData<T>(data: T) {
        const {error} = this.schemaForFindContacts.validate(data);
        // debug
        this.logger.debug('Validating find contacts data', JSON.stringify(data));
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
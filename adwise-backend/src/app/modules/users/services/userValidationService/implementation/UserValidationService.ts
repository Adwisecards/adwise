import Joi from 'joi';
import MyRegexp from 'myregexp';
import { Result } from '../../../../../core/models/Result';
import Gender from '../../../../../core/static/Gender';
import Language from '../../../../../core/static/Language';
import UserPlatform from '../../../../../core/static/UserPlatfrom';
import { ILogger } from '../../../../../services/logger/ILogger';
import { IUserValidationService } from "../IUserValidationService";

export class UserValidationService implements IUserValidationService {
    private logger: ILogger;

    private schemaForSignUp = Joi.object().keys({
        // required
        firstName: Joi.string().required(),
        lastName: Joi.string(),
        dob: Joi.date().iso(),
        password: Joi.string().min(6),
        gender: Joi.string().valid(...Gender.getList()),
        // xor
        email: Joi.string().regex(MyRegexp.email()),
        phone: Joi.string().regex(MyRegexp.phone()),
        pushToken: Joi.string(),
        pushTokenBusiness: Joi.string(),
        deviceToken: Joi.string(),
        deviceTokenBusiness: Joi.string(),
        pushNotificationsEnabled: Joi.boolean().optional(),
        language: Joi.string().optional().valid(...Language.getList()),
        organizationUser: Joi.boolean(),
        noVerification: Joi.boolean(),
        noCheck: Joi.boolean(),
        parentRefCode: Joi.string().optional().allow(''),
        pictureMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        wisewinId: Joi.string().optional()
    })
        .xor('email', 'phone')
        .min(1);

    private schemaForSignIn = Joi.object().keys({
        login: Joi.string().required().regex(MyRegexp.emailOrPhone()),
        password: Joi.string().required().min(6),
        pushToken: Joi.string(),
        pushTokenBusiness: Joi.string(),
        deviceToken: Joi.string(),
        deviceTokenBusiness: Joi.string(),
        pushNotificationsEnabled: Joi.boolean().optional(),
        language: Joi.string().optional().valid(...Language.getList()),
        isCashier: Joi.boolean(),
        isCrm: Joi.boolean(),
        isClientApp: Joi.boolean(),
    });

    private schemaForUpdate = Joi.object().keys({
        firstName: Joi.string().allow(''),
        lastName: Joi.string().allow(''),
        dob: Joi.date().iso(),
        password: Joi.string().min(6),
        gender: Joi.string().valid(...Gender.getList()),
        email: Joi.string().regex(MyRegexp.email()),
        phone: Joi.string().regex(MyRegexp.phone()),
        insta: Joi.string().regex(MyRegexp.url()).allow(''),
        fb: Joi.string().regex(MyRegexp.url()).allow(''),
        vk: Joi.string().regex(MyRegexp.url()).allow(''),
        website: Joi.string().regex(MyRegexp.url()).allow(''),
        activity: Joi.string().allow(''),
        description: Joi.string().allow(''),
        pictureFile: Joi.any(),
        legal: Joi.object().keys({
            form: Joi.string().required(),
            country: Joi.string().required(),
            info: Joi.any()
        }).optional(),
        pictureMediaId: Joi.string().optional().regex(MyRegexp.objectId())
    });

    private schemaForRestorePassword = Joi.object().keys({
        email: Joi.string().regex(MyRegexp.email()),
        phone: Joi.string().regex(MyRegexp.phone()),
    })
        .xor('email', 'phone')
        .min(1);

    private schemaForGetManagerOperations = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        limit: Joi.number().min(1).required(),
        page: Joi.number().min(1).required()
    });

    private schemaForGetUserTree = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForSetUserParent = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        parentUserId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetUserTreeChildren = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForSetUserCity = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        city: Joi.string().required()
    });

    private schemaForSetUserLanguage = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        language: Joi.string().required().valid(...Language.getList())
    });
    
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public getUserTree<T>(data: T) {
        const {error} = this.schemaForGetUserTree.validate(data);
        // debug
        this.logger.debug('Validating get user tree data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public signUpData<T>(data: T) {
        const {error} = this.schemaForSignUp.validate(data);
        // debug
        this.logger.debug('Validating sign up data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public signInData<T>(data: T) {
        const {error} = this.schemaForSignIn.validate(data);
        // debug
        this.logger.debug('Validating sign in data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }

        return Result.ok('');
    }

    public updateData<T>(data: T) {
        const {error} = this.schemaForUpdate.validate(data);
        // debug
        this.logger.debug('Validating update data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public restorePasswordData<T>(data: T) {
        const {error} = this.schemaForRestorePassword.validate(data);
        // debug
        this.logger.debug('Validating update data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getManagerOperationsData<T>(data: T) {
        const {error} = this.schemaForGetManagerOperations.validate(data);
        // debug
        this.logger.debug('Validating get manager operations data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public setUserParentData<T>(data: T) {
        const {error} = this.schemaForSetUserParent.validate(data);
        // debug
        this.logger.debug('Validating set user parent data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getUserTreeChildrenData<T>(data: T) {
        const {error} = this.schemaForGetUserTreeChildren.validate(data);
        // debug
        this.logger.debug('Validating get user tree children data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public setUserCityData<T>(data: T) {
        const {error} = this.schemaForSetUserCity.validate(data);
        // debug
        this.logger.debug('Validating set user city data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public setUserLanguageData<T>(data: T) {
        const {error} = this.schemaForSetUserLanguage.validate(data);
        // debug
        this.logger.debug('Validating set user language data', JSON.stringify(data));
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
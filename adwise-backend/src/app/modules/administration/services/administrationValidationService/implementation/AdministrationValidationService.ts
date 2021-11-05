import { IAdministrationValidationService } from "../IAdministrationValidationService";
import * as Joi from 'joi';
import { ILogger } from "../../../../../services/logger/ILogger";
import { Result } from "../../../../../core/models/Result";
import MyRegexp from "myregexp";

export class AdministrationValidationService implements IAdministrationValidationService {
    private appSchema = Joi.object().keys({
        cards: Joi.object().keys({
            ios: Joi.object().keys({
                versions: Joi.object().keys({
                    stable: Joi.string().required().regex(MyRegexp.version()),
                    latest: Joi.string().required().regex(MyRegexp.version()),
                    deprecated: Joi.string().required().regex(MyRegexp.version())
                })
            }),
            android: Joi.object().keys({
                versions: Joi.object().keys({
                    stable: Joi.string().required().regex(MyRegexp.version()),
                    latest: Joi.string().required().regex(MyRegexp.version()),
                    deprecated: Joi.string().required().regex(MyRegexp.version())
                })
            })
        }),
        business: Joi.object().keys({
            ios: Joi.object().keys({
                versions: Joi.object().keys({
                    stable: Joi.string().required().regex(MyRegexp.version()),
                    latest: Joi.string().required().regex(MyRegexp.version()),
                    deprecated: Joi.string().required().regex(MyRegexp.version())
                })
            }),
            android: Joi.object().keys({
                versions: Joi.object().keys({
                    stable: Joi.string().required().regex(MyRegexp.version()),
                    latest: Joi.string().required().regex(MyRegexp.version()),
                    deprecated: Joi.string().required().regex(MyRegexp.version())
                })
            })
        }),
    });

    private schemaForFindData = Joi.object().keys({
        sortBy: Joi.string().required(),
        order: Joi.number().required().valid(1, -1),
        pageSize: Joi.number().required().min(1).max(5000),
        pageNumber: Joi.number().required().min(1),
        export: Joi.any(),
        total: Joi.any()
    }).unknown(true);

    private schemaForAddDocument = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().allow(''),
        disabled: Joi.boolean(),
        documentFile: Joi.any().required()
    });

    private schemaForUpdateGlobal = Joi.object().keys({
        purchasePercent: Joi.number().min(0),
        managerPercent: Joi.number().min(0),
        managerPoints: Joi.number().min(0),
        contactEmail: Joi.string().allow(''),
        spareContactEmails: Joi.array().items(Joi.string()),
        balanceUnfreezeTerms: Joi.number().min(1),
        technicalWorks: Joi.boolean(),
        tipsMinimalAmount: Joi.number().min(1),
        minimalPayment: Joi.number().min(10),
        maximumPayment: Joi.number().min(10),
        paymentGatewayPercent: Joi.number().min(0),
        paymentGatewayMinimalFee: Joi.number().min(0),
        paymentRetention: Joi.number().min(0),
        app: this.appSchema
    });

    private schemaForAddTask = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        points: Joi.number().required().min(0),
        disabled: Joi.boolean(),
    });

    private schemaForCreateGlobalShop = Joi.object().keys({
        billingDescriptor: Joi.string().required(),
        fullName: Joi.string().required(),
        name: Joi.string().required(),
        inn: Joi.string().required().min(10).max(10),
        kpp: Joi.string().required().min(9).max(9),
        ogrn: Joi.string().required(),
        addresses: Joi.array().required().min(1).items(Joi.object().keys({
            type: Joi.string().valid('legal', 'actual', 'post', 'other').required(),
            zip: Joi.string().required(),
            country: Joi.string().required(),
            city: Joi.string().required(),
            street: Joi.string().required()
        })),
        phones: Joi.array().required().min(1).items(Joi.object().keys({
            type: Joi.string().valid('common', 'fax', 'other').required(),
            phone: Joi.string().required().regex(MyRegexp.phone())
        })),
        email: Joi.string().required().regex(MyRegexp.email()),
        ceo: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            middleName: Joi.string().required(),
            birthDate: Joi.date().iso().required(),
            phone: Joi.string().required().regex(MyRegexp.phone())
        }),
        bankAccount: Joi.object({
            account: Joi.string().required(),
            korAccount: Joi.string().required(),
            bankName: Joi.string().required(),
            bik: Joi.string().required(),
            details: Joi.string().required(),
            tax: Joi.number().required().min(0)
        })
    });

    private schemaForSetUserAdminGuest = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        targetUserId: Joi.string().required().regex(MyRegexp.objectId()),
        adminGuest: Joi.boolean().required()
    });

    private logger: ILogger;
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public setUserAdminGuestData<T>(data: T) {
        const {error} = this.schemaForSetUserAdminGuest.validate(data);
        // debug
        this.logger.debug('Validating set user admin data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public findData<T>(data: T) {
        const {error} = this.schemaForFindData.validate(data);
        // debug
        this.logger.debug('Validating find data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public addDocumentData<T>(data: T) {
        const {error} = this.schemaForAddDocument.validate(data);
        // debug
        this.logger.debug('Validating add document data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }
    
    public updateGlobalData<T>(data: T) {
        const {error} = this.schemaForUpdateGlobal.validate(data);
        // debug
        this.logger.debug('Validating update global data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public addTaskData<T>(data: T) {
        const {error} = this.schemaForAddTask.validate(data);
        // debug
        this.logger.debug('Validating add task data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createGlobalShopData<T>(data: T) {
        const {error} = this.schemaForCreateGlobalShop.validate(data);
        // debug
        this.logger.debug('Validating create global shop data', JSON.stringify(data));
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
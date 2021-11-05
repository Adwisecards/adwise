import Joi, { string } from 'joi';
import MyRegexp from 'myregexp';
import { join } from 'path';
import { Result } from '../../../../../../core/models/Result';
import Country from '../../../../../../core/static/Country';
import OrganizationPaymentType from '../../../../../../core/static/OrganizationPaymentType';
import OrganizationType from '../../../../../../core/static/OrganizationType';
import { ILogger } from '../../../../../../services/logger/ILogger';
import { IOrganizationValidationService } from "../IOrganizationValidationService";

export class OrganizationValidationService implements IOrganizationValidationService {
    private logger: ILogger;
    
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    private schemaForCreateOrganization = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        name: Joi.string().required(),
        description: Joi.string(),
        briefDescription: Joi.string().required(),
        addressId: Joi.string().required().regex(MyRegexp.objectId()),
        phones: Joi.array().items(Joi.string().regex(MyRegexp.phone())).min(0),
        emails: Joi.array().items(Joi.string().regex(MyRegexp.email())).min(0),
        categoryId: Joi.string().regex(MyRegexp.objectId()).required(),
        tags: Joi.array().items(Joi.string()).min(1),
        website: Joi.string().regex(MyRegexp.url()).allow(''),
        socialMedia: Joi.object().keys({
            vk: Joi.string().regex(MyRegexp.url()).allow(''),
            insta: Joi.string().regex(MyRegexp.url()).allow(''),
            fb: Joi.string().regex(MyRegexp.url()).allow('')
        }).optional(),
        schedule: Joi.object().keys({
            monday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            tuesday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            wednesday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            thursday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            friday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            saturday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            sunday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required()
        }).optional(),
        distributionSchema: Joi.object().keys({
            first: Joi.number().min(0).max(100).required(),
            other: Joi.number().min(0).max(100).required()
        }).required(),
        colors: {
            primary: Joi.string().optional(),
            secondary: Joi.string().optional()
        },
        cashback: Joi.number().min(0).max(100),
        mainPictureMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        pictureMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        requestedPacketId: Joi.string().optional().regex(MyRegexp.objectId())
    });

    private schemaForUpdateOrganization = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        categoryId: Joi.string().regex(MyRegexp.objectId()),
        description: Joi.string().allow(''),
        briefDescription: Joi.string(),
        addressId: Joi.string().optional().regex(MyRegexp.objectId()),
        phones: Joi.array().items(Joi.string().regex(MyRegexp.phone())).min(0),
        emails: Joi.array().items(Joi.string().regex(MyRegexp.email())).min(0),
        tags: Joi.array().items(Joi.string()).min(1),
        website: Joi.string().regex(MyRegexp.url()).allow(''),
        socialMedia: Joi.object().keys({
            vk: Joi.string().regex(MyRegexp.url()).allow(''),
            insta: Joi.string().regex(MyRegexp.url()).allow(''),
            fb: Joi.string().regex(MyRegexp.url()).allow('')
        }).optional(),
        primaryColor: Joi.string(),
        colors: Joi.object().keys({
            primary: Joi.string().optional(),
            secondary: Joi.string().optional()
        }).optional(),
        schedule: Joi.object().keys({
            monday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            tuesday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            wednesday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            thursday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            friday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            saturday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required(),
            sunday: Joi.object().keys({
                from: Joi.string().required(),
                to: Joi.string().required()
            }).required()
        }).optional(),
        cashback: Joi.number().min(0),
        distributionSchema: Joi.object().keys({
            first: Joi.number().min(0).max(100).required(),
            other: Joi.number().min(0).max(100).required()
        }).optional(),
        legal: Joi.object().keys({
            form: Joi.string().required(),
            country: Joi.string().required(),
            info: Joi.any()
        }).optional(),
        mainPictureMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        pictureMediaId: Joi.string().optional().regex(MyRegexp.objectId()),
        addressCoords: Joi.array().optional().length(2).items(Joi.number().min(0))
    });

    private schemaForFindOrganizations = Joi.object().keys({
        search: Joi.string().required(),
        limit: Joi.number().required().min(1),
        page: Joi.number().required().min(1),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        inCity: Joi.boolean().optional(),
        categoryIds: Joi.array().items(Joi.string().regex(MyRegexp.objectId())).optional()
    });

    private schemaForCreateOrganizationShop = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        organizationId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetOrganizationClients = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        limit: Joi.number().optional().min(1),
        page: Joi.number().optional().min(1),
        sortBy: Joi.string().optional(),
        search: Joi.string().optional(),
        order: Joi.any().optional(),
        export: Joi.boolean().optional()
    });

    private schemaForGetOrganizationPurchases = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        limit: Joi.number().optional().min(1),
        page: Joi.number().optional().min(1),
        sortBy: Joi.string().optional(),
        order: Joi.any().optional(),
        export: Joi.boolean().optional(),
        dateFrom: Joi.date().iso().optional(),
        dateTo: Joi.date().iso().optional(),
        multiple: Joi.boolean().optional(),
        types: Joi.array().items(Joi.string().valid('confirmed', 'shared', 'new', 'processing', 'complete', 'archived')).optional(),
        refCode: Joi.string().optional(),
        cashierContactId: Joi.string().optional().regex(MyRegexp.objectId()),
        purchaserContactId: Joi.string().optional().regex(MyRegexp.objectId())
    });

    private schemaForGetOrganizationOperations = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        export: Joi.boolean().optional(),
        limit: Joi.number().optional().min(1),
        page: Joi.number().optional().min(1)
    });

    private schemaForGetOrganizationCoupons = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        export: Joi.boolean().optional(),
        limit: Joi.number().optional().min(1),
        page: Joi.number().optional().min(1),
        all: Joi.boolean().optional(),
        type: Joi.string().optional(),
        disabled: Joi.boolean().optional()
    });

    private schemaForSendEnrollmentRequest = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        packetId: Joi.string().required().regex(MyRegexp.objectId()),
        comment: Joi.string().required(),
        files: Joi.array().optional(),
        managerNeeded: Joi.boolean().required(),
        email: Joi.string().allow('')
    });

    private schemaForGetOrganizationFinancialReport = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        dateFrom: Joi.date().iso().required(),
        dateTo: Joi.date().iso().required()
    });

    private schemaForGetOrganizationDocuments = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForRequestPaymentType = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        paymentType: Joi.string().required().valid(...OrganizationPaymentType.getList())
    });

    private schemaForIncreaseOrganizationDeposit = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        sum: Joi.number().min(0).required()
    });

    private schemaForSetDemoOrganization = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        demo: Joi.boolean().required()
    });

    private schemaForRequestLegalInfoUpdate = Joi.object().keys({
        legal: Joi.object().keys({
            form: Joi.string().required(),
            country: Joi.string().required(),
            info: Joi.any().required()
        }),
        organizationId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForSetAddressCoords = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        coords: Joi.array().length(2).items(Joi.number()).required()
    });

    private schemaForGenerateDocuments = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetContactOrganizations = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        contactId: Joi.string().required().regex(MyRegexp.objectId()),
        sortBy: Joi.string().optional(),
        order: Joi.number().optional().valid(-1, 1),
        limit: Joi.number().optional().min(1),
        page: Joi.number().optional().min(1),
        search: Joi.string().optional(),
        categoryIds: Joi.array().items(Joi.string().regex(MyRegexp.objectId())).optional()
    });

    public setAddressCoordsData<T>(data: T) {
        const {error} = this.schemaForSetAddressCoords.validate(data);
        // debug
        this.logger.debug('Validating set address coords data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public requestLegalInfoUpdate<T>(data: T) {
        const {error} = this.schemaForRequestLegalInfoUpdate.validate(data);
        // debug
        this.logger.debug('Validating request legal info update data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public setDemoOrganization<T>(data: T) {
        const {error} = this.schemaForSetDemoOrganization.validate(data);
        // debug
        this.logger.debug('Validating set demo organization data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public increaseOrganizationDepositData<T>(data: T) {
        const {error} = this.schemaForIncreaseOrganizationDeposit.validate(data);
        // debug
        this.logger.debug('Validating increase organization deposit data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public requestPaymentTypeData<T>(data: T) {
        const {error} = this.schemaForRequestPaymentType.validate(data);
        // debug
        this.logger.debug('Validating request payment type data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }
    
    public getOrganizationDocumentsData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationDocuments.validate(data);
        // debug
        this.logger.debug('Validating get organization documents data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public sendEnrollmentRequestData<T>(data: T) {
        const {error} = this.schemaForSendEnrollmentRequest.validate(data);
        // debug
        this.logger.debug('Validating send enrollment request data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationFinancialReport<T>(data: T) {
        const {error} = this.schemaForGetOrganizationFinancialReport.validate(data);
        // debug
        this.logger.debug('Validating get organization financial report data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationCouponsData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationCoupons.validate(data);
        // debug
        this.logger.debug('Validating get organization coupons data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationOperationsData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationOperations.validate(data);
        // debug
        this.logger.debug('Validating get organization operations data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createOrganizationShopData<T>(data: T) {
        const {error} = this.schemaForCreateOrganizationShop.validate(data);
        // debug
        this.logger.debug('Validating create organization data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createOrganizationData<T>(data: T) {
        const {error} = this.schemaForCreateOrganization.validate(data);
        // debug
        this.logger.debug('Validating create organization data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updateOrganizationData<T>(data: T) {
        const {error} = this.schemaForUpdateOrganization.validate(data);
        // debug
        this.logger.debug('Validating create organization shop data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public findOrganizationsData<T>(data: T) {
        const {error} = this.schemaForFindOrganizations.validate(data);
        // debug
        this.logger.debug('Validating find organizations data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationClientsData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationClients.validate(data);
        // debug
        this.logger.debug('Validating get organization clients data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationPurchasesData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationPurchases.validate(data);
        // debug
        this.logger.debug('Validating get organization purchases data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public generateDocumentsData<T>(data: T) {
        const {error} = this.schemaForGenerateDocuments.validate(data);
        // debug
        this.logger.debug('Validating generate documents data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getContactOrganizationsData<T>(data: T) {
        const {error} = this.schemaForGetContactOrganizations.validate(data);
        // debug
        this.logger.debug('Validating get contact organizations data', JSON.stringify(data));
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
import { ILegalValidationService } from "../ILegalValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";
import Country from "../../../../../../core/static/Country";
import CountryLegalForm from "../../../../../../core/static/CountryLegalForm";

export class LegalValidationService implements ILegalValidationService {
    private schemaForGetOrganizationLegal = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForCreateLegal = Joi.object().keys({
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        country: Joi.string().required().valid(...Country.getList()),
        form: Joi.string().required(),
        relevant: Joi.boolean().optional()
    }).custom((value: any, helpers: Joi.CustomHelpers) => {
        if (!!CountryLegalForm.getList(value.country)?.find(f => f == value.form)) {
            return value;
        } else {
            return helpers.error('string.invalid');
        }
    });

    private schemaForCreateIndividualLegal = this.schemaForCreateLegal.keys({
        info: Joi.object().keys({
            organizationName: Joi.string().required().allow(''),
            inn: Joi.string().required().allow(''),
            ogrn: Joi.string().required().allow(''),
            siteUrl: Joi.string().required().allow(''),
            phone: Joi.string().required().regex(MyRegexp.phone()).allow(''),
            email: Joi.string().required().regex(MyRegexp.email()).allow(''),
            dob: Joi.date().required().iso().allow(''),
            pob: Joi.string().required().allow(''),
            citizenship: Joi.string().required().allow(''),
            document: Joi.object().keys({
                type: Joi.string().required().allow(''),
                issueDate: Joi.date().required().iso().allow(''),
                issuedBy: Joi.string().required().allow(''),
                serialNumber: Joi.string().required().allow(''),
                departmentCode: Joi.string().required().allow('')
            }).required(),
            addresses: Joi.object().keys({
                legal: Joi.object().keys({
                    country: Joi.string().required().allow('').valid(...Country.getList()),
                    city: Joi.string().required().allow(''),
                    street: Joi.string().required().allow(''),
                    zip: Joi.string().required().allow(''),
                }).required(),
                mailing: Joi.object().keys({
                    country: Joi.string().required().allow('').valid(...Country.getList()),
                    city: Joi.string().required().allow(''),
                    street: Joi.string().required().allow(''),
                    zip: Joi.string().required().allow(''),
                }).required()
            }).required(),
            bankAccount: Joi.object().keys({
                account: Joi.string().required().allow(''),
                name: Joi.string().required().allow(''),
                bik: Joi.string().required().allow(''),
                korAccount: Joi.string().required().allow('')
            }).required()
        })
    });

    private schemaForCreateIpLegal = this.schemaForCreateLegal.keys({
        info: Joi.object().keys({
            organizationName: Joi.string().required().allow(''),
            inn: Joi.string().required().allow(''),
            ogrn: Joi.string().required().allow(''),
            kpp: Joi.string().required().allow(''),
            siteUrl: Joi.string().required().allow(''),
            billingDescriptor: Joi.string().required().allow(''),
            phone: Joi.string().required().regex(MyRegexp.phone()).allow(''),
            email: Joi.string().required().regex(MyRegexp.email()).allow(''),
            addresses: Joi.object().keys({
                legal: Joi.object().keys({
                    country: Joi.string().required().allow('').valid(...Country.getList()),
                    city: Joi.string().required().allow(''),
                    street: Joi.string().required().allow(''),
                    zip: Joi.string().required().allow(''),
                }).required(),
                mailing: Joi.object().keys({
                    country: Joi.string().required().allow('').valid(...Country.getList()),
                    city: Joi.string().required().allow(''),
                    street: Joi.string().required().allow(''),
                    zip: Joi.string().required().allow(''),
                }).required()
            }).required(),
            bankAccount: Joi.object().keys({
                account: Joi.string().required().allow(''),
                name: Joi.string().required().allow(''),
                bik: Joi.string().required().allow(''),
                korAccount: Joi.string().required().allow('')
            }).required(),
            ceo: Joi.object().keys({
                firstName: Joi.string().required().allow(''),
                lastName: Joi.string().required().allow(''),
                middleName: Joi.string().required().allow(''),
                address: Joi.string().required().allow(''),
                dob: Joi.date().required().iso().allow(''),
                pob: Joi.string().required().allow(''),
                citizenship: Joi.string().required().allow(''),
                document: Joi.object().keys({
                    type: Joi.string().required().allow(''),
                    issueDate: Joi.date().required().iso().allow(''),
                    issuedBy: Joi.string().required().allow(''),
                    serialNumber: Joi.string().required().allow(''),
                    departmentCode: Joi.string().required().allow('')
                }).required(),
                phone: Joi.string().required().regex(MyRegexp.phone()).allow('')
            }).required()
        })
    });

    private schemaForCreateOOOLegal = this.schemaForCreateLegal.keys({
        info: Joi.object().keys({
            organizationName: Joi.string().required().allow(''),
            inn: Joi.string().required().allow(''),
            ogrn: Joi.string().required().allow(''),
            kpp: Joi.string().required().allow(''),
            siteUrl: Joi.string().required().allow(''),
            billingDescriptor: Joi.string().required().allow(''),
            phone: Joi.string().required().regex(MyRegexp.phone()).allow(''),
            email: Joi.string().required().regex(MyRegexp.email()).allow(''),
            addresses: Joi.object().keys({
                legal: Joi.object().keys({
                    country: Joi.string().required().allow('').valid(...Country.getList()),
                    city: Joi.string().required().allow(''),
                    street: Joi.string().required().allow(''),
                    zip: Joi.string().required().allow(''),
                }).required(),
                mailing: Joi.object().keys({
                    country: Joi.string().required().allow('').valid(...Country.getList()),
                    city: Joi.string().required().allow(''),
                    street: Joi.string().required().allow(''),
                    zip: Joi.string().required().allow(''),
                }).required()
            }).required(),
            bankAccount: Joi.object().keys({
                account: Joi.string().required().allow(''),
                name: Joi.string().required().allow(''),
                bik: Joi.string().required().allow(''),
                korAccount: Joi.string().required().allow('')
            }).required(),
            ceo: Joi.object().keys({
                firstName: Joi.string().required().allow(''),
                lastName: Joi.string().required().allow(''),
                middleName: Joi.string().required().allow(''),
                address: Joi.string().required().allow(''),
                dob: Joi.date().required().iso().allow(''),
                pob: Joi.string().required().allow(''),
                citizenship: Joi.string().required().allow(''),
                document: Joi.object().keys({
                    type: Joi.string().required().allow(''),
                    issueDate: Joi.date().required().iso().allow(''),
                    issuedBy: Joi.string().required().allow(''),
                    serialNumber: Joi.string().required().allow(''),
                    departmentCode: Joi.string().required().allow('')
                }).required(),
                phone: Joi.string().required().regex(MyRegexp.phone()).allow('')
            }).required(),
            founder: Joi.object().keys({
                firstName: Joi.string().required().allow(''),
                lastName: Joi.string().required().allow(''),
                middleName: Joi.string().required().allow(''),
                address: Joi.string().required().allow(''),
                dob: Joi.date().required().iso().allow(''),
                pob: Joi.string().required().allow(''),
                citizenship: Joi.string().required().allow(''),
                document: Joi.object().keys({
                    type: Joi.string().required().allow(''),
                    issueDate: Joi.date().required().iso().allow(''),
                    issuedBy: Joi.string().required().allow(''),
                    serialNumber: Joi.string().required().allow(''),
                    departmentCode: Joi.string().required().allow('')
                }).required(),
                phone: Joi.string().required().regex(MyRegexp.phone()).allow('')
            }).required()
        })
    });

    private schemaForUpdateLegal = Joi.object().keys({
        legalId: Joi.string().required().regex(MyRegexp.objectId()),
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetOrganizationLegals = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        organizationId: Joi.string().required().regex(MyRegexp.objectId())
    });

    // update legal

    private schemaForUpdateLegalInfo = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        organizationId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForUpdateIndividualLegalInfo = this.schemaForUpdateLegalInfo.keys({
        info: Joi.object().keys({
            siteUrl: Joi.string().required().allow(''),
            phone: Joi.string().required().regex(MyRegexp.phone()).allow(''),
            email: Joi.string().required().regex(MyRegexp.email()).allow(''),
            dob: Joi.date().required().iso().allow(''),
            pob: Joi.string().required().allow(''),
            citizenship: Joi.string().required().allow(''),
            document: Joi.object({
                type: Joi.string().required().allow(''),
                issueDate: Joi.date().required().iso().allow(''),
                issuedBy: Joi.string().required().allow(''),
                serialNumber: Joi.string().required().allow(''),
                departmentCode: Joi.string().required().allow('')
            }).required()
        })
    });

    private schemaForUpdateIpLegalInfo = this.schemaForUpdateLegalInfo.keys({
        // info: Joi.object().keys({
        //     siteUrl: Joi.string().required().allow(''),
        //     phone: Joi.string().required().regex(MyRegexp.phone()).allow(''),
        //     email: Joi.string().required().regex(MyRegexp.email()).allow(''),
        //     dob: Joi.date().required().iso().allow(''),
        //     pob: Joi.string().required().allow(''),
        //     citizenship: Joi.string().required().allow(''),
        //     document: Joi.object({
        //         type: Joi.string().required().allow(''),
        //         issueDate: Joi.date().required().iso().allow(''),
        //         issuedBy: Joi.string().required().allow(''),
        //         serialNumber: Joi.string().required().allow(''),
        //         departmentCode: Joi.string().required().allow('')
        //     }).required()
        // })
    });

    private schemaForUpdateOOOLegalInfo = this.schemaForUpdateLegalInfo.keys({
        // info: Joi.object().keys({
        //     siteUrl: Joi.string().required().allow(''),
        //     phone: Joi.string().required().regex(MyRegexp.phone()).allow(''),
        //     email: Joi.string().required().regex(MyRegexp.email()).allow(''),
        //     dob: Joi.date().required().iso().allow(''),
        //     pob: Joi.string().required().allow(''),
        //     citizenship: Joi.string().required().allow(''),
        //     document: Joi.object({
        //         type: Joi.string().required().allow(''),
        //         issueDate: Joi.date().required().iso().allow(''),
        //         issuedBy: Joi.string().required().allow(''),
        //         serialNumber: Joi.string().required().allow(''),
        //         departmentCode: Joi.string().required().allow('')
        //     }).required()
        // })
    });

    private schemaForCheckLegalInn = Joi.object().keys({
        inn: Joi.string().required().min(10).max(12)
    });

    public getOrganizationLegalData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationLegal.validate(data);
        // debug
        logger.debug('Validating get organization legal data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createIndividualLegal<T>(data: T) {
        const {error} = this.schemaForCreateIndividualLegal.validate(data);
        // debug
        logger.debug('Validating create individual legal data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createIpLegal<T>(data: T) {
        const {error} = this.schemaForCreateIpLegal.validate(data);
        // debug
        logger.debug('Validating create ip legal data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public createOOOLegal<T>(data: T) {
        const {error} = this.schemaForCreateOOOLegal.validate(data);
        // debug
        logger.debug('Validating create ooo legal data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updateLegalData<T>(data: T) {
        const {error} = this.schemaForUpdateLegal.validate(data);
        // debug
        logger.debug('Validating update legal data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getOrganizationLegalsData<T>(data: T) {
        const {error} = this.schemaForGetOrganizationLegals.validate(data);
        // debug
        logger.debug('Validating get organization legals data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updateIndividualLegalInfo<T>(data: T) {
        const {error} = this.schemaForUpdateIndividualLegalInfo.validate(data);
        // debug
        logger.debug('Validating update individual legal info data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updateIpLegalInfo<T>(data: T) {
        const {error} = this.schemaForUpdateIpLegalInfo.validate(data);
        // debug
        logger.debug('Validating update ip legal info data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updateOOOLegalInfo<T>(data: T) {
        const {error} = this.schemaForUpdateOOOLegalInfo.validate(data);
        // debug
        logger.debug('Validating update OOO legal info data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public checkLegalInnData<T>(data: T) {
        const {error} = this.schemaForCheckLegalInn.validate(data);
        // debug
        logger.debug('Validating check legal inn info data', JSON.stringify(data));
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
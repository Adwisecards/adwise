import { ILogger } from "../../../../../../services/logger/ILogger";
import { IPacketValidationService } from "../IPacketValidationService";
import * as Joi from 'joi';
import { Result } from "../../../../../../core/models/Result";
import Currency from "../../../../../../core/static/Currency";
import MyRegexp from "myregexp";

export class PacketValidationService implements IPacketValidationService {
    private logger: ILogger;
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    private schemaForCreatePacket = Joi.object().keys({
        name: Joi.string().required(),
        price: Joi.number().required().min(0),
        limit: Joi.number().required().min(0),
        currency: Joi.number().required().valid(...Currency.getList()),
        managerReward: Joi.number().required().min(0),
        refBonus: Joi.number().required().min(0),
        period: Joi.number().required().min(1),
        wisewinOption: Joi.boolean().required()
    });

    private schemaForSetPacket = Joi.object().keys({
        packetId: Joi.string().required().regex(MyRegexp.objectId()),
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        date: Joi.date().iso(),
        noRecord: Joi.boolean(),
        asWisewinOption: Joi.boolean(),
        reason: Joi.string().optional()
    });

    private schemaForUpdatePacket = Joi.object().keys({
        packetId: Joi.string().required().regex(MyRegexp.objectId()),
        name: Joi.string(),
        price: Joi.number().min(0),
        wisewinOption: Joi.boolean()
    });

    private schemaForChooseWinwinOptionPacket = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        packetId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForAddPacketToOrganization = Joi.object().keys({
        packetId: Joi.string().optional().regex(MyRegexp.objectId()),
        organizationId: Joi.string().required().regex(MyRegexp.objectId()),
        default: Joi.boolean().optional(),
        date: Joi.date().iso().optional(),
        customPacket: Joi.object().keys({
            price: Joi.number().min(0).required(),
            name: Joi.string().required(),
            managerReward: Joi.number().min(0).required(),
            refBonus: Joi.number().min(0).required(),
            currency: Joi.number().required().valid(...Currency.getList()),
            limit: Joi.number().min(0).required()
        }).optional(),
        reason: Joi.string().optional()
    });

    private schemaForRequestPacket = Joi.object().keys({
        packetId: Joi.string().required().regex(MyRegexp.objectId()),
        email: Joi.string().required().regex(MyRegexp.email()),
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        generateDocuments: Joi.boolean().required()
    });

    public addPacketToOrganizationData<T>(data: T) {
        const {error} = this.schemaForAddPacketToOrganization.validate(data);
        // debug
        this.logger.debug('Validating add packet to organization data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public updatePacketData<T>(data: T) {
        const {error} = this.schemaForUpdatePacket.validate(data);
        // debug
        this.logger.debug('Validating update packet data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }
    
    public createPacketData<T>(data: T) {
        const {error} = this.schemaForCreatePacket.validate(data);
        // debug
        this.logger.debug('Validating create packet data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public setPacketData<T>(data: T) {
        const {error} = this.schemaForSetPacket.validate(data);
        // debug
        this.logger.debug('Validating set packet data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public chooseWisewinOptionPacketData<T>(data: T) {
        const {error} = this.schemaForChooseWinwinOptionPacket.validate(data);
        // debug
        this.logger.debug('Validating choose wisewin option packet data', JSON.stringify(data));
        if (error) {
            this.logger.debug('Validation failed');
            this.logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            this.logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public requestPacketData<T>(data: T) {
        const {error} = this.schemaForRequestPacket.validate(data);
        // debug
        this.logger.debug('Validating request packet data', JSON.stringify(data));
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
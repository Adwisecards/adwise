import { IFavoriteOrganizationListValidationService } from "../IFavoriteOrganizationListValidationService";
import Joi from 'joi';
import MyRegexp from "myregexp";
import { logger } from "../../../../../../services/logger";
import { Result } from "../../../../../../core/models/Result";

export class FavoriteOrganizationListValidationService implements IFavoriteOrganizationListValidationService {
    private schemaForAddOrganizationToUserFavoriteList = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        organizationId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForRemoveOrganizationFromUserFavoriteList = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId()),
        organizationId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private schemaForGetUserFavoriteOrganizations = Joi.object().keys({
        userId: Joi.string().required().regex(MyRegexp.objectId())
    });

    public addOrganizationToUserFavoriteListData<T>(data: T) {
        const { error } = this.schemaForAddOrganizationToUserFavoriteList.validate(data);
        // debug
        logger.debug('Validating add organization to user favorite list data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public removeOrganizationFromUserFavoriteListData<T>(data: T) {
        const { error } = this.schemaForRemoveOrganizationFromUserFavoriteList.validate(data);
        // debug
        logger.debug('Validating remove organization from user favorite list data', JSON.stringify(data));
        if (error) {
            logger.debug('Validation failed');
            logger.debug(error.details[0].message);
            return Result.fail(error.details[0].message);
        } else {
            logger.debug('Validation went successful');
        }
        
        return Result.ok('');
    }

    public getUserFavoriteOrganizationsData<T>(data: T) {
        const { error } = this.schemaForGetUserFavoriteOrganizations.validate(data);
        // debug
        logger.debug('Validating get user favorite organizations data', JSON.stringify(data));
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
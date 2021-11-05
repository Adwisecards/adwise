import { IProductValidationService } from "../IProductValidationService";
import Joi from 'joi';
import ProductType from "../../../../../../core/static/ProductType";
import { ILogger } from "../../../../../../services/logger/ILogger";
import { Result } from "../../../../../../core/models/Result";
import MyRegexp from "myregexp";

export class ProductValidationService implements IProductValidationService {
    private schemaForCreateProduct = Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        type: Joi.string().required().valid(...ProductType.getList()),
        pictureFile: Joi.any(),
        code: Joi.string().required(),
        price: Joi.number().required().min(0),
        disabled: Joi.boolean().required(),
        organizationId: Joi.string().required().regex(MyRegexp.objectId())
    });

    private logger: ILogger;
    
    constructor(logger: ILogger) {
        this.logger = logger;
    }

    public createProductData<T>(data: T) {
        const {error} = this.schemaForCreateProduct.validate(data);
        // debug
        this.logger.debug('Validating create product data', JSON.stringify(data));
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
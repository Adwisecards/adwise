import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IProductRepo } from "../../../repo/products/IProductRepo";
import { DisableProductDTO } from "./DisableProductDTO";
import { disableProductErrors } from "./disableProductErrors";

export class DisableProductUseCase implements IUseCase<DisableProductDTO.Request, DisableProductDTO.Response> {
    private productRepo: IProductRepo;
    public errors = [
        ...disableProductErrors
    ];
    constructor(productRepo: IProductRepo) {
        this.productRepo = productRepo;
    }

    public async execute(req: DisableProductDTO.Request): Promise<DisableProductDTO.Response> {
        if (!Types.ObjectId(req.productId) || typeof req.disabled != 'boolean') {
            return Result.fail(UseCaseError.create('c', 'Invalid productId or disabled'));
        }

        const productFound = await this.productRepo.findById(req.productId);
        if (productFound.isFailure) {
            return Result.fail(productFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding product') : UseCaseError.create('b', 'Product is not found'));
        }

        const product = productFound.getValue()!;

        product.disabled = req.disabled;

        const productSaved = await this.productRepo.save(product);
        if (productSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving product'));
        }

        return Result.ok({productId: req.productId});
    }
}
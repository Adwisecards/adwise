import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IProductRepo } from "../../../repo/products/IProductRepo";
import { GetProductDTO } from "./GetProductDTO";
import { getProductErrors } from "./getProductErrors";

export class GetProductUseCase implements IUseCase<GetProductDTO.Request, GetProductDTO.Response> {
    private productRepo: IProductRepo;
    public errors = [
        ...getProductErrors
    ];

    constructor(productRepo: IProductRepo) {
        this.productRepo = productRepo;
    }

    public async execute(req: GetProductDTO.Request): Promise<GetProductDTO.Response> {
        if (!Types.ObjectId.isValid(req.productId)) {
            return Result.fail(UseCaseError.create('c', 'productId is not valid'));
        }

        const productFound = await this.productRepo.findById(req.productId);
        if (productFound.isFailure) {
            return Result.fail(productFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding product') : UseCaseError.create('b', 'Product does not exist'));
        }

        const product = productFound.getValue()!;

        return Result.ok({product});
    }
}
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IProductRepo } from "../../../repo/products/IProductRepo";
import { GetOrganizationProductsDTO } from "./GetOrganizationProductsDTO";
import { getOrganizationProductsErrors } from "./getOrganizationProductsErrors";

export class GetOrganizationProductsUseCase implements IUseCase<GetOrganizationProductsDTO.Request, GetOrganizationProductsDTO.Response> {
    private productRepo: IProductRepo;

    public errors = [
        ...getOrganizationProductsErrors
    ];

    constructor(productRepo: IProductRepo) {
        this.productRepo = productRepo;
    }

    public async execute(req: GetOrganizationProductsDTO.Request): Promise<GetOrganizationProductsDTO.Response> {
        if (req.limit < 0 || req.page < 0 || !Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c'));
        }
        
        const productsFound = await this.productRepo.findByOrganization(req.organizationId, req.type, req.limit, req.page);
        if (productsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding products'));
        }

        const products = productsFound.getValue()!;

        return Result.ok({products});
    }
}
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IWallet } from "../../../../finance/models/Wallet";
import { CreateRefUseCase } from "../../../../ref/useCases/createRef/CreateRefUseCase";
import { ProductModel } from "../../../models/Product";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IProductRepo } from "../../../repo/products/IProductRepo";
import { IProductValidationService } from "../../../services/products/productValidationService/IProductValidationService";
import { CreateProductDTO } from "./CreateProductDTO";
import { createProductErrors } from "./createProductErrors";

export class CreateProductUseCase implements IUseCase<CreateProductDTO.Request, CreateProductDTO.Response> {
    private productRepo: IProductRepo;
    private organizationRepo: IOrganizationRepo;
    private createRefUseCase: CreateRefUseCase;
    private productValidationService: IProductValidationService;
    private mediaService: IMediaService;

    public errors = [
        ...createProductErrors
    ];

    constructor(
        productRepo: IProductRepo, 
        organizationRepo: IOrganizationRepo, 
        productValidationService: IProductValidationService, 
        createRefUseCase: CreateRefUseCase,
        mediaService: IMediaService
    ) {
        this.organizationRepo = organizationRepo;
        this.productRepo = productRepo;
        this.productValidationService = productValidationService;
        this.createRefUseCase = createRefUseCase;
        this.mediaService = mediaService;
    }

    public async execute(req: CreateProductDTO.Request): Promise<CreateProductDTO.Response> {
        const valid = this.productValidationService.createProductData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l', 'Organization is not found'));
        }

        const organization = await organizationFound.getValue()!.populate('wallet').execPopulate();

        let pictureUrl;
        if (req.pictureFile) {
            const pictureSaved = await this.mediaService.save(req.pictureFile.filename, req.pictureFile.data);
            if (pictureSaved.isFailure) {
                console.log(pictureSaved.getError())
                return Result.fail(UseCaseError.create('a', 'Error upon saving pictures'));
            }
    
            pictureUrl = pictureSaved.getValue()!;
        }

        req.picture = pictureUrl;

        const product = new ProductModel({
            name: req.name,
            description: req.description,
            disabled: req.disabled,
            code: req.code,
            currency: (<IWallet>(<any>organization.wallet)).currency,
            price: req.price,
            organization: req.organizationId,
            type: req.type,
            picture: req.picture
        });

        const refCreated = await this.createRefUseCase.execute({
            ref: product._id,
            mode: 'product',
            type: 'purchase'
        });

        if (refCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating ref'));
        }

        const ref = refCreated.getValue()!;

        product.ref = ref;

        const productSaved = await this.productRepo.save(product);
        if (productSaved.isFailure) {
            console.log(productSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving product'));
        }

        organization.products.push(product._id);

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({productId: product._id});
    }
}
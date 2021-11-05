import { mediaService } from "../../../../../services/mediaService";
import { createRefUseCase } from "../../../../ref/useCases/createRef";
import { organizationRepo } from "../../../repo/organizations";
import { productRepo } from "../../../repo/products";
import { productValidationService } from "../../../services/products/productValidationService";
import { CreateProductController } from "./CreateProductController";
import { CreateProductUseCase } from "./CreateProductUseCase";

const createProductUseCase = new CreateProductUseCase(
    productRepo, 
    organizationRepo, 
    productValidationService, 
    createRefUseCase, 
    mediaService
);
const createProductController = new CreateProductController(createProductUseCase);

export {
    createProductUseCase,
    createProductController
};
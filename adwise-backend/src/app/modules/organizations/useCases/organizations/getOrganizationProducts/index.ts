import { productRepo } from "../../../repo/products";
import { GetOrganizationProductsController } from "./GetOrganizationProductsController";
import { GetOrganizationProductsUseCase } from "./GetOrganizationProductsUseCase";

const getOrganizationProductsUseCase = new GetOrganizationProductsUseCase(productRepo);
const getOrganizationProductsController = new GetOrganizationProductsController(getOrganizationProductsUseCase);

export {
    getOrganizationProductsUseCase,
    getOrganizationProductsController
};
import { productRepo } from "../../../repo/products";
import { GetProductController } from "./GetProductController";
import { GetProductUseCase } from "./GetProductUseCase";

const getProductUseCase = new GetProductUseCase(productRepo);
const getProductController = new GetProductController(getProductUseCase);

export {
    getProductUseCase,
    getProductController
};
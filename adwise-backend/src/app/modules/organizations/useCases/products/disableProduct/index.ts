import { productRepo } from "../../../repo/products";
import { DisableProductController } from "./DisableProductController";
import { DisableProductUseCase } from "./DisableProductUseCase";

const disableProductUseCase = new DisableProductUseCase(productRepo);
const disableProductController = new DisableProductController(disableProductUseCase);

export {
    disableProductUseCase,
    disableProductController
};
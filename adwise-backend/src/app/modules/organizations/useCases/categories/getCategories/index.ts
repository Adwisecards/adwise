import { categoryRepo } from "../../../repo/categories";
import { GetCategoriesController } from "./GetCategoriesController";
import { GetCategoriesUseCase } from "./GetCategoriesUseCase";

const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepo);
const getCategoriesController = new GetCategoriesController(getCategoriesUseCase);

export {
    getCategoriesUseCase,
    getCategoriesController
};
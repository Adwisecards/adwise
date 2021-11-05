import { categoryRepo } from "../../../repo/categories";
import { CreateCategoryController } from "./CreateCategoryController";
import { CreateCategoryUseCase } from "./CreateCategoryUseCase";

const createCategoryUseCase = new CreateCategoryUseCase(categoryRepo);
const createCategoryController = new CreateCategoryController(createCategoryUseCase);

export {
    createCategoryUseCase,
    createCategoryController
};
import { categoryRepo } from "../../../repo/categories";
import { organizationRepo } from "../../../repo/organizations";
import { DeleteCategoryController } from "./DeleteCategoryController";
import { DeleteCategoryUseCase } from "./DeleteCategoryUseCase";

const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo, organizationRepo);
const deleteCategoryController = new DeleteCategoryController(deleteCategoryUseCase);

export {
    deleteCategoryUseCase,
    deleteCategoryController
};
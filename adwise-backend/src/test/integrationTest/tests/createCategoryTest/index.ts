import { categoryRepo } from "../../../../app/modules/organizations/repo/categories";
import { createCategoryUseCase } from "../../../../app/modules/organizations/useCases/categories/createCategory";
import { CreateCategoryTest } from "./CreateCategoryTest";

export const createCategoryTest = new CreateCategoryTest(
    categoryRepo,
    createCategoryUseCase
);
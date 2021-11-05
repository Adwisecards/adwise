import { questionCategoryRepo } from "../../../repo/questionCategories";
import { GetQuestionCategoriesController } from "./GetQuestionCategoriesController";
import { GetQuestionCategoriesUseCase } from "./GetQuestionCategoriesUseCase";

export const getQuestionCategoriesUseCase = new GetQuestionCategoriesUseCase(questionCategoryRepo);
export const getQuestionCategoriesController = new GetQuestionCategoriesController(getQuestionCategoriesUseCase);
import { questionCategoryRepo } from "../../../repo/questionCategories";
import { DeleteQuestionCategoryController } from "./DeleteQuestionCategoryController";
import { DeleteQuestionCategoryUseCase } from "./DeleteQuestionCategoryUseCase";

export const deleteQuestionCategoryUseCase = new DeleteQuestionCategoryUseCase(questionCategoryRepo);
export const deleteQuestionCategoryController = new DeleteQuestionCategoryController(deleteQuestionCategoryUseCase);
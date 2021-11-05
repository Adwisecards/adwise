import { questionCategoryRepo } from "../../../repo/questionCategories";
import { CreateQuestionCategoryController } from "./CreateQuestionCategoryController";
import { CreateQuestionCategoryUseCase } from "./CreateQuestionCategoryUseCase";

export const createQuestionCategoryUseCase = new CreateQuestionCategoryUseCase(questionCategoryRepo);
export const createQuestionCategoryController = new CreateQuestionCategoryController(createQuestionCategoryUseCase);
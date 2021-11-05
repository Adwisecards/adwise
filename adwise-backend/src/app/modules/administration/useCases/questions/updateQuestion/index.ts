import { questionCategoryRepo } from "../../../repo/questionCategories";
import { questionRepo } from "../../../repo/questions";
import { questionValidationService } from "../../../services/questionValidationService";
import { UpdateQuestionController } from "./UpdateQuestionController";
import { UpdateQuestionUseCase } from "./UpdateQuestionUseCase";

export const updateQuestionUseCase = new UpdateQuestionUseCase(questionRepo, questionCategoryRepo, questionValidationService);
export const updateQuestionController = new UpdateQuestionController(updateQuestionUseCase);
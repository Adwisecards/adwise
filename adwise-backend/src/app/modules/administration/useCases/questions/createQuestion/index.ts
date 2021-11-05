import { questionCategoryRepo } from "../../../repo/questionCategories";
import { questionRepo } from "../../../repo/questions";
import { questionValidationService } from "../../../services/questionValidationService";
import { CreateQuestionController } from "./CreateQuestionController";
import { CreateQuestionUseCase } from "./CreateQuestionUseCase";

export const createQuestionUseCase = new CreateQuestionUseCase(questionRepo, questionCategoryRepo, questionValidationService);
export const createQuestionController = new CreateQuestionController(createQuestionUseCase);
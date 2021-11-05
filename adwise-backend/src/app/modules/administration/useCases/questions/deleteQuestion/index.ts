import { questionRepo } from "../../../repo/questions";
import { DeleteQuestionController } from "./DeleteQuestionController";
import { DeleteQuestionUseCase } from "./DeleteQuestionUseCase";

export const deleteQuestionUseCase = new DeleteQuestionUseCase(questionRepo);
export const deleteQuestionController = new DeleteQuestionController(deleteQuestionUseCase);
import { questionRepo } from "../../../repo/questions";
import { GetQuestionsbyTypeController } from "./GetQuestionsByTypeController";
import { GetQuestionsByTypeUseCase } from "./GetQuestionsByTypeUseCase";

export const getQuestionsByTypeUseCase = new GetQuestionsByTypeUseCase(questionRepo);
export const getQuestionsByTypeController = new GetQuestionsbyTypeController(getQuestionsByTypeUseCase);
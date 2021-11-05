import { QuestionModel } from "../../models/Question";
import { QuestionRepo } from "./implementation/QuestionRepo";

export const questionRepo = new QuestionRepo(QuestionModel);
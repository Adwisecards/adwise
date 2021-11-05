import { QuestionCategoryModel } from "../../models/QuestionCategory";
import { QuestionCategoryRepo } from "./implementation/QuestionCategoryRepo";

export const questionCategoryRepo = new QuestionCategoryRepo(QuestionCategoryModel);
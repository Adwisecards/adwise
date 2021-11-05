import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { QuestionCategoryModel } from "../../../models/QuestionCategory";
import { IQuestionCategoryRepo } from "../../../repo/questionCategories/IQuestionCategoryRepo";
import { CreateQuestionCategoryDTO } from "./CreateQuestionCategoryDTO";
import { createQuestionCategoryErrors } from "./createQuestionCategoryErrors";

export class CreateQuestionCategoryUseCase implements IUseCase<CreateQuestionCategoryDTO.Request, CreateQuestionCategoryDTO.Response> {
    private questionCategoryRepo: IQuestionCategoryRepo;

    public errors = createQuestionCategoryErrors;

    constructor(questionCategoryRepo: IQuestionCategoryRepo) {
        this.questionCategoryRepo = questionCategoryRepo;
    }

    public async execute(req: CreateQuestionCategoryDTO.Request): Promise<CreateQuestionCategoryDTO.Response> {
        if (!req.name) {
            return Result.fail(UseCaseError.create('c', 'name is not valid'));
        }

        const questionCategoryFound = await this.questionCategoryRepo.findByName(req.name);
        if (questionCategoryFound.isFailure && questionCategoryFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding question category'));
        }

        if (questionCategoryFound.isSuccess) {
            return Result.fail(UseCaseError.create('f', 'Question category already exist'));
        }

        const questionCategory = new QuestionCategoryModel({
            name: req.name
        });

        const questionCategorySaved = await this.questionCategoryRepo.save(questionCategory);
        if (questionCategorySaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving question category'));
        }

        return Result.ok({questionCategoryId: questionCategory._id});
    }
}
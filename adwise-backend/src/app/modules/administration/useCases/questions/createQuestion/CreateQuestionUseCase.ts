import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { QuestionModel } from "../../../models/Question";
import { IQuestionCategoryRepo } from "../../../repo/questionCategories/IQuestionCategoryRepo";
import { IQuestionRepo } from "../../../repo/questions/IQuestionRepo";
import { IQuestionValidationService } from "../../../services/questionValidationService/IQuestionValidationService";
import { CreateQuestionDTO } from "./CreateQuestionDTO";
import { createQuestionErrors } from "./createQuestionErrors";

export class CreateQuestionUseCase implements IUseCase<CreateQuestionDTO.Request, CreateQuestionDTO.Response> {
    private questionRepo: IQuestionRepo;
    private questionCategoryRepo: IQuestionCategoryRepo;
    private questionValidationService: IQuestionValidationService;

    public errors = createQuestionErrors;

    constructor(
        questionRepo: IQuestionRepo,
        questionCategoryRepo: IQuestionCategoryRepo,
        questionValidationService: IQuestionValidationService
    ) {
        this.questionRepo = questionRepo;
        this.questionCategoryRepo = questionCategoryRepo;
        this.questionValidationService = questionValidationService;
    }

    public async execute(req: CreateQuestionDTO.Request): Promise<CreateQuestionDTO.Response> {
        const valid = this.questionValidationService.createQuestionData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const questionCategoryFound = await this.questionCategoryRepo.findById(req.categoryId);
        if (questionCategoryFound.isFailure) {
            return Result.fail(questionCategoryFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding question category') : UseCaseError.create('9'));
        }

        const questionCategory = questionCategoryFound.getValue()!;

        const question = new QuestionModel({
            type: req.type,
            category: questionCategory._id,
            question: req.question,
            answer: req.answer
        });

        const questionFound = await this.questionRepo.save(question);
        if (questionFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving question'));
        }

        return Result.ok({questionId: question._id.toString()});
    }
}
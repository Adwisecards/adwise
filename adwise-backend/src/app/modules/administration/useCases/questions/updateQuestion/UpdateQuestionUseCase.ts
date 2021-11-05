import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IQuestionCategory } from "../../../models/QuestionCategory";
import { IQuestionCategoryRepo } from "../../../repo/questionCategories/IQuestionCategoryRepo";
import { IQuestionRepo } from "../../../repo/questions/IQuestionRepo";
import { IQuestionValidationService } from "../../../services/questionValidationService/IQuestionValidationService";
import { UpdateQuestionDTO } from "./UpdateQuestionDTO";
import { updateQuestionErrors } from "./updateQuestionErrors";

export class UpdateQuestionUseCase implements IUseCase<UpdateQuestionDTO.Request, UpdateQuestionDTO.Response> {
    private questionRepo: IQuestionRepo;
    private questionCategoryRepo: IQuestionCategoryRepo;
    private questionValidationService: IQuestionValidationService;

    public errors = updateQuestionErrors;

    constructor(
        questionRepo: IQuestionRepo,
        questionCategoryRepo: IQuestionCategoryRepo,
        questionValidationService: IQuestionValidationService
    ) {
        this.questionRepo = questionRepo;
        this.questionCategoryRepo = questionCategoryRepo;
        this.questionValidationService = questionValidationService;
    }

    public async execute(req: UpdateQuestionDTO.Request): Promise<UpdateQuestionDTO.Response> {
        const valid = this.questionValidationService.updateQuestionData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const questionFound = await this.questionRepo.findById(req.questionId);
        if (questionFound.isFailure) {
            return Result.fail(questionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding question') : UseCaseError.create('a1'));
        }

        const question = questionFound.getValue()!;

        let questionCategory: IQuestionCategory;

        if (req.categoryId) {
            const questionCategoryFound = await this.questionCategoryRepo.findById(req.categoryId);
            if (questionCategoryFound.isFailure) {
                return Result.fail(questionCategoryFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding question category') : UseCaseError.create('9'));
            }

            questionCategory = questionCategoryFound.getValue()!;
        }

        if (questionCategory!) {
            question.category = questionCategory!._id;
        }

        if (req.question) {
            question.question = req.question;
        }

        if (req.answer) {
            question.answer = req.answer;
        }

        if (req.type) {
            question.type == req.type;
        }

        const questionSaved = await this.questionRepo.save(question);
        if (questionSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving question'));
        }

        return Result.ok({
            questionId: req.questionId
        });
    }
}
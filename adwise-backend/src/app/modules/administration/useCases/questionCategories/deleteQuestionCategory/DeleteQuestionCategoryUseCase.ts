import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IQuestionCategoryRepo } from "../../../repo/questionCategories/IQuestionCategoryRepo";
import { DeleteQuestionCategoryDTO } from "./DeleteQuestionCategoryDTO";
import { deleteQuestionCategoryErrors } from "./deleteQuestionCategoryErrors";

export class DeleteQuestionCategoryUseCase implements IUseCase<DeleteQuestionCategoryDTO.Request, DeleteQuestionCategoryDTO.Response> {
    private questionCategoryRepo: IQuestionCategoryRepo;
    
    public errors = deleteQuestionCategoryErrors;

    constructor(questionCategoryRepo: IQuestionCategoryRepo) {
        this.questionCategoryRepo = questionCategoryRepo;
    }

    public async execute(req: DeleteQuestionCategoryDTO.Request): Promise<DeleteQuestionCategoryDTO.Response> {
        if (!Types.ObjectId.isValid(req.questionCategoryId)) {
            return Result.fail(UseCaseError.create('c', 'questionCategoryId is not valid'));
        }

        const questionCategoryFound = await this.questionCategoryRepo.findById(req.questionCategoryId);
        if (questionCategoryFound.isFailure) {
            return Result.fail(questionCategoryFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding question category') : UseCaseError.create('9'));
        }

        const questionCategoryDeleted = await this.questionCategoryRepo.deleteById(req.questionCategoryId);
        if (questionCategoryDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting question category'));
        }

        return Result.ok({questionCategoryId: req.questionCategoryId});
    }
}
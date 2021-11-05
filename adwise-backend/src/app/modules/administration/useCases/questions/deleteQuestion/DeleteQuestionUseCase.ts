import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IQuestionRepo } from "../../../repo/questions/IQuestionRepo";
import { DeleteQuestionDTO } from "./DeleteQuestionDTO";
import { deleteQuestionErrors } from "./deleteQuestionErrors";

export class DeleteQuestionUseCase implements IUseCase<DeleteQuestionDTO.Request, DeleteQuestionDTO.Response> {
    private questionRepo: IQuestionRepo;

    public errors = deleteQuestionErrors;

    constructor(questionRepo: IQuestionRepo) {
        this.questionRepo = questionRepo;
    }

    public async execute(req: DeleteQuestionDTO.Request): Promise<DeleteQuestionDTO.Response> {
        if (!Types.ObjectId.isValid(req.questionId)) {
            return Result.fail(UseCaseError.create('c', 'questionId is not valid'));
        }

        const questionFound = await this.questionRepo.findById(req.questionId);
        if (questionFound.isFailure) {
            return Result.fail(questionFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding question') : UseCaseError.create('a1'));
        }

        const questionDeleted = await this.questionRepo.deleteById(req.questionId);
        if (questionDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting question'));
        }

        return Result.ok({questionId: req.questionId});
    }
}
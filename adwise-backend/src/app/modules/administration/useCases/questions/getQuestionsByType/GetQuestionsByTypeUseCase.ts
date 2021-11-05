import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import QuestionType from "../../../../../core/static/QuestionType";
import { IQuestionRepo } from "../../../repo/questions/IQuestionRepo";
import { GetQuestionsByTypeDTO } from "./GetQuestionsByTypeDTO";
import { getQuestionsByTypeErrors } from "./getQuestionsByTypeErrors";

export class GetQuestionsByTypeUseCase implements IUseCase<GetQuestionsByTypeDTO.Request, GetQuestionsByTypeDTO.Response> {
    private questionRepo: IQuestionRepo;
    
    public errors = getQuestionsByTypeErrors;

    constructor(questionRepo: IQuestionRepo) {
        this.questionRepo = questionRepo;
    }

    public async execute(req: GetQuestionsByTypeDTO.Request): Promise<GetQuestionsByTypeDTO.Response> {
        if (!QuestionType.isValid(req.type)) {
            return Result.fail(UseCaseError.create('c', 'type is not valid'));
        }

        const questionsFound = await this.questionRepo.findManyByType(req.type);
        if (questionsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding questions'));
        }

        const questions = questionsFound.getValue()!;

        return Result.ok({questions});
    }
}
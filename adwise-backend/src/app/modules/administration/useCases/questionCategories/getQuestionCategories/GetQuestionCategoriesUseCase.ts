import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IQuestionCategoryRepo } from "../../../repo/questionCategories/IQuestionCategoryRepo";
import { GetQuestionCategoriesDTO } from "./GetQuestionCategoriesDTO";
import { getQuestionCategoriesErrors } from "./getQuestionCategoriesErrors";

export class GetQuestionCategoriesUseCase implements IUseCase<GetQuestionCategoriesDTO.Request, GetQuestionCategoriesDTO.Response> {
    private questionCategoryRepo: IQuestionCategoryRepo;

    public errors = getQuestionCategoriesErrors;

    constructor(questionCategoryRepo: IQuestionCategoryRepo) {
        this.questionCategoryRepo = questionCategoryRepo;
    }

    public async execute(_: GetQuestionCategoriesDTO.Request): Promise<GetQuestionCategoriesDTO.Response> {
        const questionCategoriesGotten = await this.questionCategoryRepo.getAll();
        if (questionCategoriesGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting question categories'));
        }

        const questionCategories = questionCategoriesGotten.getValue()!;

        return Result.ok({questionCategories});
    }
}
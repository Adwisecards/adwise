import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICategoryRepo } from "../../../repo/categories/ICategoryRepo";
import { GetCategoriesDTO } from "./GetCategoriesDTO";
import { getCategoriesErrors } from "./getCategoriesErrors";

export class GetCategoriesUseCase implements IUseCase<GetCategoriesDTO.Request, GetCategoriesDTO.Response> {
    private categoryRepo: ICategoryRepo;
    public errors: UseCaseError[] = [
        ...getCategoriesErrors
    ];
    constructor(categoryRepo: ICategoryRepo) {
        this.categoryRepo = categoryRepo;
    }

    public async execute(_: GetCategoriesDTO.Request): Promise<GetCategoriesDTO.Response> {
        const categoriesFound = await this.categoryRepo.getAll();
        if (categoriesFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding categories'));
        }

        const categories = categoriesFound.getValue()!;
        return Result.ok({categories});
    }
}
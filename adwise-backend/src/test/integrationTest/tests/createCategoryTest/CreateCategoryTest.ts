import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { ICategory } from "../../../../app/modules/organizations/models/Category";
import { ICategoryRepo } from "../../../../app/modules/organizations/repo/categories/ICategoryRepo";
import { CreateCategoryDTO } from "../../../../app/modules/organizations/useCases/categories/createCategory/CreateCategoryDTO";
import { CreateCategoryUseCase } from "../../../../app/modules/organizations/useCases/categories/createCategory/CreateCategoryUseCase";

interface ICreateCategoryObjects {
    category: ICategory;
};

export class CreateCategoryTest {
    private categoryRepo: ICategoryRepo;
    private createCategoryUseCase: CreateCategoryUseCase;

    constructor(
        categoryRepo: ICategoryRepo,
        createCategoryUseCase: CreateCategoryUseCase
    ) {
        this.categoryRepo = categoryRepo;
        this.createCategoryUseCase = createCategoryUseCase;
    }

    public async execute(): Promise<Result<ICreateCategoryObjects | null, UseCaseError | null>> {
        const categoryData: CreateCategoryDTO.Request = {
            name: 'category'
        };

        const categoryCreated = await this.createCategoryUseCase.execute(categoryData);
        if (categoryCreated.isFailure) {
            return Result.fail(categoryCreated.getError());
        }

        const { categoryId } = categoryCreated.getValue()!;

        const categoryFound = await this.categoryRepo.findById(categoryId);
        if (categoryFound.isFailure) {
            return Result.fail(categoryFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding category') : UseCaseError.create('b', 'Category does not exist'));
        }

        const category = categoryFound.getValue()!;

        if (categoryData.name != category.name) {
            return Result.fail(UseCaseError.create('c', 'Name is not correct'));
        }

        return Result.ok({category});
    }
}
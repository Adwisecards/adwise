import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { ICategoryRepo } from "../../../repo/categories/ICategoryRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { DeleteCategoryDTO } from "./DeleteCategoryDTO";
import { deleteCategoryErrors } from "./deleteCategoryErrors";

export class DeleteCategoryUseCase implements IUseCase<DeleteCategoryDTO.Request, DeleteCategoryDTO.Response> {
    private categoryRepo: ICategoryRepo;
    private organizationRepo: IOrganizationRepo;
    public errors: UseCaseError[] = [
        ...deleteCategoryErrors
    ];
    constructor(categoryRepo: ICategoryRepo, organizationRepo: IOrganizationRepo) {
        this.categoryRepo = categoryRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: DeleteCategoryDTO.Request): Promise<DeleteCategoryDTO.Response> {
        if (!Types.ObjectId.isValid(req.categoryId)) {
            return Result.fail(UseCaseError.create('c', 'Category ID is required and must be valid'));
        }

        const categoryFound = await this.categoryRepo.findById(req.categoryId);
        if (categoryFound.isFailure) {
            return Result.fail(categoryFound.getError()!.code == 500 ? UseCaseError.create('a') : UseCaseError.create('b'));
        }

        const category = categoryFound.getValue()!;

        const organizationsFound = await this.organizationRepo.findByCategory(category.name);
        if (organizationsFound.isSuccess && organizationsFound.getValue()!.length != 0) {
            return Result.fail(UseCaseError.create('c', 'Cannot delete categories used by organizations'));
        }

        const categoryDeleted = await this.categoryRepo.deleteById(category._id);
        if (categoryDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting category'));
        }

        return Result.ok({categoryId: req.categoryId});
    }
}
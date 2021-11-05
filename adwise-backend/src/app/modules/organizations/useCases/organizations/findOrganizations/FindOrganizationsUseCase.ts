import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { FindOrganizationsDTO } from "./FindOrganizationsDTO";
import { findOrganizationsErrors } from "./findOrganizationsErrors";

export class FindOrganizationsUseCase implements IUseCase<FindOrganizationsDTO.Request, FindOrganizationsDTO.Response> {
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;
    
    public errors: UseCaseError[] = [
        ...findOrganizationsErrors
    
    ];
    constructor(
        userRepo: IUserRepo,
        organizationRepo: IOrganizationRepo, 
        organizationValidationService: IOrganizationValidationService
    ) {
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
    }

    public async execute(req: FindOrganizationsDTO.Request): Promise<FindOrganizationsDTO.Response> {
        const valid = this.organizationValidationService.findOrganizationsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        let city = req.inCity ? user.address?.city || '' : '';

        const organizationsFound = await this.organizationRepo.findOrganizations(req.search, city, req.categoryIds, req.limit, req.page);
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organizations'));
        }

        const organizations = organizationsFound.getValue()!;

        return Result.ok({organizations});
    }
}
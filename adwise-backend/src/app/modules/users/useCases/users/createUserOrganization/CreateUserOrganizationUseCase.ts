import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { CreateOrganizationUseCase } from "../../../../organizations/useCases/organizations/createOrganization/CreateOrganizationUseCase";
import { IUserRepo } from "../../../repo/users/IUserRepo";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateUserOrganizationDTO } from "./CreateUserOrganizationDTO";
import { createUserOrganizationErrors } from "./createUserOrganizationErrors";

export class CreateUserOrganizationUseCase implements IUseCase<CreateUserOrganizationDTO.Request, CreateUserOrganizationDTO.Response> {
    private createUserUseCase: CreateUserUseCase;
    private createOrganizationUseCase: CreateOrganizationUseCase;
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    public errors: UseCaseError[] = [
        ...createUserOrganizationErrors
    ];

    constructor(createUserUseCase: CreateUserUseCase, createOrganizationUseCase: CreateOrganizationUseCase, userRepo: IUserRepo, organizationRepo: IOrganizationRepo) {
        this.createOrganizationUseCase = createOrganizationUseCase;
        this.createUserUseCase = createUserUseCase;
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
    }

    public async execute(req: CreateUserOrganizationDTO.Request): Promise<CreateUserOrganizationDTO.Response> {
        const userCreated = await this.createUserUseCase.execute(req.user);
        if (userCreated.isFailure) {
            return Result.fail(userCreated.getError());
        }

        const userCreatedData = userCreated.getValue()!;

        const organizationCreated = await this.createOrganizationUseCase.execute(req.organization);
        if (organizationCreated.isFailure) {
            await this.userRepo.deleteById(userCreatedData.userId);
            return Result.fail(organizationCreated.getError());
        }

        const organizationCreatedData = organizationCreated.getValue()!;

        const userFound = await this.userRepo.findById(userCreatedData.userId);
        if (userFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user'));
        }

        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationCreatedData.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization'));
        } 

        const organization = organizationFound.getValue()!;

        user.organization = organization._id;
        organization.user = user._id;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const userSaved = await this.userRepo.save(user);
        if (userSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user'));
        }

        return Result.ok({...userCreatedData});
    }
}
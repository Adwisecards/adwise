import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { configProps } from "../../../../../services/config";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IAuthService } from "../../../../users/services/authService/IAuthService";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { CreateDemoOrganizationUseCase } from "../createDemoOrganization/CreateDemoOrganizationUseCase";
import { GetDemoOrganizationJwtDTO } from "./GetDemoOrganizationJwtDTO";
import { getDemoOrganizationJwtErrors } from "./getDemoOrganizationJwtErrors";

export class GetDemoOrganizationJwtUseCase implements IUseCase<GetDemoOrganizationJwtDTO.Request, GetDemoOrganizationJwtDTO.Response> {
    private userRepo: IUserRepo
    private authService: IAuthService;
    private organizationRepo: IOrganizationRepo;
    private createDemoOrganizationUseCase: CreateDemoOrganizationUseCase;

    public errors = getDemoOrganizationJwtErrors;

    constructor(
        userRepo: IUserRepo,
        authService: IAuthService,
        organizationRepo: IOrganizationRepo,
        createDemoOrganizationUseCase: CreateDemoOrganizationUseCase
    ) {
        this.userRepo = userRepo;
        this.authService = authService;
        this.organizationRepo = organizationRepo;
        this.createDemoOrganizationUseCase = createDemoOrganizationUseCase;
    }

    public async execute(_: GetDemoOrganizationJwtDTO.Request): Promise<GetDemoOrganizationJwtDTO.Response> {
        if (!configProps.demo) {
            return Result.fail(UseCaseError.create('c', 'Demo organization cannot be created in this environment'));
        }
        
        try {
            const demoOrganizationCreated = await this.createDemoOrganizationUseCase.execute({});
            if (demoOrganizationCreated.isFailure) {
                console.log(demoOrganizationCreated.getError());
                return Result.fail(UseCaseError.create('a', 'Error upon creating demo organization'));
            }

            const { organizationId } = demoOrganizationCreated.getValue()!;

            const organizationFound = await this.organizationRepo.findById(organizationId);
            if (organizationFound.isFailure) {
                return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding demo organization') : UseCaseError.create('l', 'Demo organization does not exist'));
            }

            const organization = organizationFound.getValue()!;

            const userFound = await this.userRepo.findById(organization.user.toString());
            if (userFound.isFailure) {
                return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
            }

            const user = userFound.getValue()!;

            const jwtCreated = await this.authService.sign({
                admin: false,
                userId: user._id.toString(),
                adminGuest: false
            });

            const jwt = jwtCreated.getValue()!;

            return Result.ok({
                jwt: jwt
            });
        } catch (ex) {
            console.log(ex);
            return Result.ok({jwt: ''});
        }

        
    }
}
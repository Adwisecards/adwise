import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ILegal } from "../../../models/Legal";
import { ILegalRepo } from "../../../repo/legal/ILegalRepo";
import { ILegalValidationService } from "../../../services/legal/legalValidationService/ILegalValidationService";
import { GenerateOrganizationDocumentUseCase } from "../../organizationDocuments/generateOrganizationDocument/GenerateOrganizationDocumentUseCase";
import { UpdateLegalDTO } from "./UpdateLegalDTO";
import { updateLegalErrors } from "./updateLegalErrors";

interface IKeyObjects {
    legal: ILegal;
    relevantLegal?: ILegal;
    organization: IOrganization;
    user: IUser;
};

export class UpdateLegalUseCase implements IUseCase<UpdateLegalDTO.Request, UpdateLegalDTO.Response> {
    private userRepo: IUserRepo;
    private legalRepo: ILegalRepo;
    private organizationRepo: IOrganizationRepo;
    private legalValidationService: ILegalValidationService;
    private generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase;

    public errors = updateLegalErrors;

    constructor(
        userRepo: IUserRepo,
        legalRepo: ILegalRepo,
        organizationRepo: IOrganizationRepo,
        legalValidationService: ILegalValidationService,
        generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase
    ) { 
        this.userRepo = userRepo;
        this.legalRepo = legalRepo;
        this.organizationRepo = organizationRepo;
        this.legalValidationService = legalValidationService;
        this.generateOrganizationDocumentUseCase = generateOrganizationDocumentUseCase;
    }

    public async execute(req: UpdateLegalDTO.Request): Promise<UpdateLegalDTO.Response> {
        const valid = this.legalValidationService.updateLegalData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.legalId, req.userId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            legal,
            organization,
            relevantLegal,
            user
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        if (legal.relevant) {
            return Result.fail(UseCaseError.create('c', 'Legal is already relevant'));
        }

        if (relevantLegal) relevantLegal.relevant = false;
        legal.relevant = true;

        if (relevantLegal) {
            const relevantLegalSaved = await this.legalRepo.save(relevantLegal);
            if (relevantLegalSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving relevant legal'));
            }
        }

        const legalSaved = await this.legalRepo.save(legal);
        if (legalSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon saving legal"));
        }

        await this.generateOrganizationDocumentUseCase.execute({
            organizationId: organization._id.toString(),
            type: 'treaty',
            userId: organization.user.toString()
        });
        await this.generateOrganizationDocumentUseCase.execute({
            organizationId: organization._id.toString(),
            type: 'application',
            userId: organization.user.toString()
        });

        return Result.ok({legalId: legal._id.toString()});
    }

    private async getKeyObjects(legalId: string, userId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const legalFound = await this.legalRepo.findById(legalId);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4'));
        }

        const legal = legalFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(legal.organization.toString()!);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let relevantLegal: ILegal | undefined;

        const relevantLegalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (relevantLegalFound.isSuccess) {
            relevantLegal = relevantLegalFound.getValue()!;
        }

        return Result.ok({
            legal,
            organization,
            relevantLegal,
            user
        });
    }
}
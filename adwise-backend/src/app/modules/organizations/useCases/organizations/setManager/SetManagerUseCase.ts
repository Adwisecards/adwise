import Joi from "joi";
import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { GenerateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument/GenerateOrganizationDocumentUseCase";
import { IRef } from "../../../../ref/models/Ref";
import { IRefRepo } from "../../../../ref/repo/IRefRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganization } from "../../../models/Organization";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { SetManagerDTO } from "./SetManagerDTO";
import { setManagerErrors } from "./setManagerErrors";

interface IKeyObjects {
    userManager: IUser;
    userManagerRef: IRef;
    organization: IOrganization;
};

export class SetManagerUseCase implements IUseCase<SetManagerDTO.Request, SetManagerDTO.Response> {
    private refRepo: IRefRepo;
    private userRepo: IUserRepo;
    private organizationRepo: IOrganizationRepo;
    private generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase;

    public errors = setManagerErrors;

    constructor(
        refRepo: IRefRepo,
        userRepo: IUserRepo, 
        organizationRepo: IOrganizationRepo,
        generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase 
    ) {
        this.refRepo = refRepo;
        this.userRepo = userRepo;
        this.organizationRepo = organizationRepo;
        this.generateOrganizationDocumentUseCase = generateOrganizationDocumentUseCase;
    }

    public async execute(req: SetManagerDTO.Request): Promise<SetManagerDTO.Response> {
        if (!Types.ObjectId.isValid(req.organizationId)) {
            return Result.fail(UseCaseError.create('c', 'organizationId is not valid'));
        }

        if (!req.userManagerRefCode || req.userManagerRefCode.length != 8) {
            return Result.fail(UseCaseError.create('c', 'userManagerId is not valid'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.organizationId, req.userManagerRefCode);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            userManager,
            organization,
            userManagerRef
        } = keyObjectsGotten.getValue()!;
        
        if (organization.manager) {
            return Result.fail(UseCaseError.create('f', 'Manager is already appointed'));
        }
        
        if (!userManager.wisewinId) {
            return Result.fail(UseCaseError.create('c', 'User is not a wise manager'));
        }

        organization.manager = userManager._id;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        await this.generateOrganizationDocumentUseCase.execute({
            organizationId: organization._id.toString(),
            type: 'application',
            userId: organization.user.toString()
        });

        return Result.ok({organizationId: req.organizationId});
    }

    private async getKeyObjects(organizationId: string, userManagerRefCode: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        const userManagerRefFound = await this.refRepo.findByCode(userManagerRefCode);
        if (userManagerRefFound.isFailure) {
            return Result.fail(userManagerRefFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding ref') : UseCaseError.create('b', 'Ref does not exist'));
        }

        const userManagerRef = userManagerRefFound.getValue()!;

        const userManagerFound = await this.userRepo.findById(userManagerRef.ref.toHexString());
        if (userManagerFound.isFailure) {
            return Result.fail(userManagerFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user manager') : UseCaseError.create('m'));
        }

        const userManager = userManagerFound.getValue()!;

        return Result.ok({
            userManager,
            organization,
            userManagerRef
        });
    }
}
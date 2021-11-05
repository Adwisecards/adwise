import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { GetOrganizationDocumentsDTO } from "./GetOrganizationDocumentsDTO";
import { IOrganizationDocumentRepo } from "../../../repo/organizationDocuments/IOrganizationDocumentRepo";
import { IOrganizationDocumentValidationService } from "../../../services/organizationDocuments/organizationDocumentValidationService/IOrganizationDocumentValidationService";
import { getOrganizationDocumentsErrors } from "./getOrganizationDocumentsErrors";

export class GetOrganizationDocumentsUseCase implements IUseCase<GetOrganizationDocumentsDTO.Request, GetOrganizationDocumentsDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private organizationDocumentRepo: IOrganizationDocumentRepo;
    private organizationDocumentValidationService: IOrganizationDocumentValidationService;

    public errors = getOrganizationDocumentsErrors;

    constructor(
        organizationRepo: IOrganizationRepo,
        organizationDocumentRepo: IOrganizationDocumentRepo,
        organizationDocumentValidationService: IOrganizationDocumentValidationService
    ) {
        this.organizationRepo = organizationRepo;
        this.organizationDocumentRepo = organizationDocumentRepo;
        this.organizationDocumentValidationService = organizationDocumentValidationService
    }

    public async execute(req: GetOrganizationDocumentsDTO.Request): Promise<GetOrganizationDocumentsDTO.Response> {
        const valid = this.organizationDocumentValidationService.getOrganizationDocumentsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationFound = await this.organizationRepo.findById(req.organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        // if (organization.user.toString() != req.userId) {
        //     return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        // }

        const organizationDocumentsFound = await this.organizationDocumentRepo.findManyByOrganization(req.organizationId, req.type);
        if (organizationDocumentsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', "Error upon finding organization documents"));
        }

        const organizationDocuments = organizationDocumentsFound.getValue()!;

        return Result.ok({organizationDocuments})
    }
}
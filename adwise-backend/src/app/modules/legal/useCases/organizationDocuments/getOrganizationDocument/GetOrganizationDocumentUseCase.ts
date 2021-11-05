import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganizationDocumentRepo } from "../../../repo/organizationDocuments/IOrganizationDocumentRepo";
import { IOrganizationDocumentValidationService } from "../../../services/organizationDocuments/organizationDocumentValidationService/IOrganizationDocumentValidationService";
import { GetOrganizationDocumentDTO } from "./GetOrganizationDocumentDTO";
import { getOrganizationDocumentErrors } from "./getOrganizationDocumentErrors";

export class GetOrganizationDocumentUseCase implements IUseCase<GetOrganizationDocumentDTO.Request, GetOrganizationDocumentDTO.Response> {
    private organizationDocumentRepo: IOrganizationDocumentRepo;
    private organizationDocumentValidationService: IOrganizationDocumentValidationService;

    public errors = getOrganizationDocumentErrors;

    constructor(
        organizationDocumentRepo: IOrganizationDocumentRepo,
        organizationDocumentValidationService: IOrganizationDocumentValidationService
    ) {
        this.organizationDocumentRepo = organizationDocumentRepo;
        this.organizationDocumentValidationService = organizationDocumentValidationService;
    }

    public async execute(req: GetOrganizationDocumentDTO.Request): Promise<GetOrganizationDocumentDTO.Response> {
        console.log(req);
        const valid = this.organizationDocumentValidationService.getOrganizationDocumentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const organizationDocumentFound = await this.organizationDocumentRepo.findById(req.organizationDocumentId);
        if (organizationDocumentFound.isFailure) {
            return Result.fail(organizationDocumentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('b3'));
        }

        const organizationDocument = organizationDocumentFound.getValue()!;

        return Result.ok({organizationDocument});
    }
}
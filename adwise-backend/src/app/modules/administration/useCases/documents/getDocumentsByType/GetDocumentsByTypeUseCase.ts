import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IDocumentRepo } from "../../../repo/documents/IDocumentRepo";
import { IDocumentValidationService } from "../../../services/documentValidationService/IDocumentValidationService";
import { GetDocumentsByTypeDTO } from "./GetDocumentsByTypeDTO";
import { getDocumentsByTypeErrors } from "./getDocumentsByTypeErrors";

export class GetDocumentsByTypeUseCase implements IUseCase<GetDocumentsByTypeDTO.Request, GetDocumentsByTypeDTO.Response> {
    private documentRepo: IDocumentRepo;
    private documentValidationService: IDocumentValidationService;

    public errors = getDocumentsByTypeErrors;

    constructor(
        documentRepo: IDocumentRepo,
        documentValidationService: IDocumentValidationService
    ) {
        this.documentRepo = documentRepo;
        this.documentValidationService = documentValidationService;
    }

    public async execute(req: GetDocumentsByTypeDTO.Request): Promise<GetDocumentsByTypeDTO.Response> {
        const valid = this.documentValidationService.getDocumentsByTypeData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const documentsFound = await this.documentRepo.findManyByType(req.type);
        if (documentsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding documents'));
        }

        const documents = documentsFound.getValue()!;

        return Result.ok({documents});
    }
}
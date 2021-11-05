import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IDocumentRepo } from "../../../repo/documents/IDocumentRepo";
import { IDocumentValidationService } from "../../../services/documentValidationService/IDocumentValidationService";
import { DeleteDocumentDTO } from "./DeleteDocumentDTO";
import { deleteDocumentErrors } from "./deleteDocumentErrors";

export class DeleteDocumentUseCase implements IUseCase<DeleteDocumentDTO.Request, DeleteDocumentDTO.Response> {
    private documentRepo: IDocumentRepo;
    private documentValidationService: IDocumentValidationService;

    public errors = deleteDocumentErrors;

    constructor(
        documentRepo: IDocumentRepo,
        documentValidationService: IDocumentValidationService
    ) {
        this.documentRepo = documentRepo;
        this.documentValidationService = documentValidationService;
    }

    public async execute(req: DeleteDocumentDTO.Request): Promise<DeleteDocumentDTO.Response> {
        const valid = this.documentValidationService.deleteDocumentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const documentFound = await this.documentRepo.findById(req.documentId);
        if (documentFound.isFailure) {
            return Result.fail(documentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding document') : UseCaseError.create('b1'));
        }

        const document = documentFound.getValue()!;

        const documentDeleted = await this.documentRepo.deleteById(document._id.toString());
        if (documentDeleted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon deleting document'));
        }

        return Result.ok({
            documentId: document._id.toString()
        });
    }
}
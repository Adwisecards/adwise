import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaRepo } from "../../../../media/repo/IMediaRepo";
import { DocumentModel } from "../../../models/Document";
import { IDocumentRepo } from "../../../repo/documents/IDocumentRepo";
import { IDocumentValidationService } from "../../../services/documentValidationService/IDocumentValidationService";
import { CreateDocumentDTO } from "./CreateDocumentDTO";
import { createDocumentErrors } from "./createDocumentErrors";

export class CreateDocumentUseCase implements IUseCase<CreateDocumentDTO.Request, CreateDocumentDTO.Response> {
    private mediaRepo: IMediaRepo;
    private documentRepo: IDocumentRepo;
    private documentValidationService: IDocumentValidationService;

    public errors = createDocumentErrors;

    constructor(
        mediaRepo: IMediaRepo,
        documentRepo: IDocumentRepo,
        documentValidationService: IDocumentValidationService
    ) {
        this.mediaRepo = mediaRepo;
        this.documentRepo = documentRepo;
        this.documentValidationService = documentValidationService;
    }

    public async execute(req: CreateDocumentDTO.Request): Promise<CreateDocumentDTO.Response> {
        const valid = this.documentValidationService.createDocumentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const mediaFound = await this.mediaRepo.findById(req.fileMediaId);
        if (mediaFound.isFailure) {
            return Result.fail(mediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding media') : UseCaseError.create('a5'));
        }

        const media = mediaFound.getValue()!;

        const document = new DocumentModel({
            name: req.name,
            description: req.description,
            file: media._id.toString(),
            index: req.index,
            type: req.type
        });

        const documentSaved = await this.documentRepo.save(document);
        if (documentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving document'));
        }

        return Result.ok({documentId: document._id.toString()});
    }
}
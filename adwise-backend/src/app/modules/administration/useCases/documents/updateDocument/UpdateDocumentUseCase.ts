import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaRepo } from "../../../../media/repo/IMediaRepo";
import { IDocumentRepo } from "../../../repo/documents/IDocumentRepo";
import { IDocumentValidationService } from "../../../services/documentValidationService/IDocumentValidationService";
import { UpdateDocumentDTO } from "./UpdateDocumentDTO";
import { updateDocumentErrors } from "./updateDocumentErrors";

export class UpdateDocumentUseCase implements IUseCase<UpdateDocumentDTO.Request, UpdateDocumentDTO.Response> {
    private mediaRepo: IMediaRepo;
    private documentRepo: IDocumentRepo;
    private documentValidationService: IDocumentValidationService;

    public errors = updateDocumentErrors;

    constructor(
        mediaRepo: IMediaRepo,
        documentRepo: IDocumentRepo,
        documentValidationService: IDocumentValidationService
    ) {
        this.mediaRepo = mediaRepo;
        this.documentRepo = documentRepo;
        this.documentValidationService = documentValidationService;
    }

    public async execute(req: UpdateDocumentDTO.Request): Promise<UpdateDocumentDTO.Response> {
        const valid = this.documentValidationService.updateDocumentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const documentFound = await this.documentRepo.findById(req.documentId);
        if (documentFound.isFailure) {
            return Result.fail(documentFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding document') : UseCaseError.create('b1'));
        }

        const document = documentFound.getValue()!;

        for (const key in req) {
            if ((<any>req)[key] != undefined) {
                if (key == 'fileMediaId') {
                    const mediaFound = await this.mediaRepo.findById(req[key]);
                    if (mediaFound.isFailure) {
                        return Result.fail(mediaFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding media') : UseCaseError.create('a5'));
                    }

                    document.file = (<any>req)[key];
                }

                (<any>document)[key] = (<any>req)[key];
            }
        }

        const documentSaved = await this.documentRepo.save(document);
        if (documentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving document'));
        }

        return Result.ok({documentId: document._id.toString()});
    } 
}
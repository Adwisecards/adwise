import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IUserDocumentRepo } from "../../../repo/userDocuments/IUserDocumentRepo";
import { IUserDocumentValidationService } from "../../../services/userDocuments/userDocumentValidationService/IUserDocumentValidationService";
import { GetUserDocumentsDTO } from "./GetUserDocumentsDTO";
import { getUserDocumentsErrors } from "./getUserDocumentsErrors";

export class GetUserDocumentsUseCase implements IUseCase<GetUserDocumentsDTO.Request, GetUserDocumentsDTO.Response> {
    private userRepo: IUserRepo;
    private userDocumentRepo: IUserDocumentRepo;
    private userDocumentValidationService: IUserDocumentValidationService;

    public errors = getUserDocumentsErrors;

    constructor(
        userRepo: IUserRepo,
        userDocumentRepo: IUserDocumentRepo,
        userDocumentValidationService: IUserDocumentValidationService
    ) {
        this.userRepo = userRepo;
        this.userDocumentRepo = userDocumentRepo;
        this.userDocumentValidationService = userDocumentValidationService;
    }

    public async execute(req: GetUserDocumentsDTO.Request): Promise<GetUserDocumentsDTO.Response> {
        const valid = this.userDocumentValidationService.getUserDocumentsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const userFound = await this.userRepo.findById(req.userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const userDocumentsFound = await this.userDocumentRepo.findManyByUserAndType(user._id.toString(), req.type);
        if (userDocumentsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user documents'));
        }

        const userDocuments = userDocumentsFound.getValue()!;

        return Result.ok({userDocuments});
    }
}
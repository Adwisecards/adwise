import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IPDFService } from "../../../../../services/pdfService/IPDFService";
import { CreateMediaUseCase } from "../../../../media/useCases/createMedia/CreateMediaUseCase";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IUserDocument, UserDocumentModel } from "../../../models/UserDocument";
import { IUserDocumentRepo } from "../../../repo/userDocuments/IUserDocumentRepo";
import { UserDocumentValidationService } from "../../../services/userDocuments/userDocumentValidationService/implementation/UserDocumentValidationService";
import { IUserDocumentValidationService } from "../../../services/userDocuments/userDocumentValidationService/IUserDocumentValidationService";
import { GenerateUserDocumentDTO } from "./GenerateUserDocumentDTO";
import { generateUserDocumentErrors } from "./generateUserDocumentErrors";

interface IKeyObjects {
    user: IUser;
};

export class GenerateUserDocumentUseCase implements IUseCase<GenerateUserDocumentDTO.Request, GenerateUserDocumentDTO.Response> {
    private userRepo: IUserRepo;
    private pdfService: IPDFService;
    private userDocumentRepo: IUserDocumentRepo;
    private createMediaUseCase: CreateMediaUseCase;
    private userDocumentValidationService: IUserDocumentValidationService;

    public errors = generateUserDocumentErrors;

    constructor(
        userRepo: IUserRepo,
        pdfService: IPDFService,
        userDocumentRepo: IUserDocumentRepo,
        createMediaUseCase: CreateMediaUseCase,
        userDocumentValidationService: UserDocumentValidationService
    ) {
        this.userRepo = userRepo;
        this.pdfService = pdfService;
        this.userDocumentRepo = userDocumentRepo;
        this.createMediaUseCase = createMediaUseCase;
        this.userDocumentValidationService = userDocumentValidationService;
    }

    public async execute(req: GenerateUserDocumentDTO.Request): Promise<GenerateUserDocumentDTO.Response> {
        const valid = this.userDocumentValidationService.generateUserDocumentData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.userId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            user
        } = keyObjectsGotten.getValue()!;

        const userDocumentGenerated = await this.generateUserDocument(req.type, user);
        if (userDocumentGenerated.isFailure) {
            return Result.fail(userDocumentGenerated.getError());
        }

        const userDocumentData = userDocumentGenerated.getValue()!;

        const userDocumentUpdated = await this.updateUserDocument(user._id.toString(), userDocumentData, req.type);
        if (userDocumentUpdated.isFailure) {
            return Result.fail(userDocumentUpdated.getError()!);
        }

        const userDocument = userDocumentUpdated.getValue()!;

        return Result.ok({userDocumentId: userDocument._id.toString()});
    }

    private async updateUserDocument(userId: string, userDocumentData: Buffer, type: string): Promise<Result<IUserDocument | null, UseCaseError | null>> {
        const documentMediaCreated = await this.createMediaUseCase.execute({
            data: userDocumentData,
            type: 'image',
            mimeType: 'application/pdf'
        });

        if (documentMediaCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating document media'));
        }

        const { mediaId: documentMediaId } = documentMediaCreated.getValue()!;
        
        let userDocument: IUserDocument | undefined;

        const userDocumentFound = await this.userDocumentRepo.findByUserAndType(userId, type);
        if (userDocumentFound.isFailure && userDocumentFound.getError()!.code == 500) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding user document'));
        }

        if (userDocumentFound.isFailure && userDocumentFound.getError()!.code == 404) {
            userDocument = new UserDocumentModel({
                type: type,
                documentMedia: documentMediaId,
                user: userId
            });
        } else {
            userDocument = userDocumentFound.getValue()!;
            
            userDocument.documentMedia = new Types.ObjectId(documentMediaId);
            userDocument.updatedAt = new Date();
        }

        const userDocumentSaved = await this.userDocumentRepo.save(userDocument);
        if (userDocumentSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving user document'));
        }

        return Result.ok(userDocument);
    }

    private async generateUserDocument(type: string, user: IUser): Promise<Result<Buffer | null, UseCaseError | null>> {
        switch (type) {
            case 'application':
                return await this.generateApplicationDocument(user);
            default:
                return Result.fail(UseCaseError.create('a', 'Unknown type'));
        }
    }

    private async generateApplicationDocument(user: IUser): Promise<Result<Buffer | null, UseCaseError | null>> {
        if (!user.legal?.info) {
            return Result.fail(UseCaseError.create('c', 'Not enough data provided'));
        }
        
        const applicationName = this.getApplicationName(user.legal.form);
        if (!applicationName) {
            return Result.fail(UseCaseError.create('c', 'Cannot get application name'));
        }

        const applicationDocumentGenerated = await this.pdfService.generatePDF(applicationName, {
            fullName: user.legal.info.fullName,
            inn: user.legal.info.inn,
            ogrn: user.legal.info.ogrn,
            identityDocumentSerialNumber: user.legal.info.identityDocumentSerialNumber,
            identityDocumentDateIssue: user.legal.info.identityDocumentDateIssue,
            identityDocumentIssuedBy: user.legal.info.identityDocumentIssuedBy,
            identityDocumentDepartmentCode: user.legal.info.identityDocumentDepartmentCode,
            residenceAddressIndex: user.legal.info.residenceAddressIndex,
            residenceAddress: user.legal.info.residenceAddress,
            phoneNumber: user.legal.info.phoneNumber,
            emailAddress: user.legal.info.emailAddress,
            'bankAccount_bankName': user.legal.info.bankAccount_bankName || user.legal.info.bankName,
            'bankAccount_bik': user.legal.info.bankAccount_bik || user.legal.info.bik,
            'bankAccount_korAccount': user.legal.info.bankAccount_korAccount || user.legal.info.korAccount,
            'bankAccount_account': user.legal.info.bankAccount_account || user.legal.info.account
        });

        if (applicationDocumentGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating application document'));
        }

        const applicationDocument = applicationDocumentGenerated.getValue()!;

        return Result.ok(applicationDocument);
    }

    private async getKeyObjects(userId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        return Result.ok({
            user
        });
    }

    private getApplicationName(form: string): string {
        if (form == 'ip') {
            return 'ipManager';
        }

        if (form == 'individual') {
            return 'individualManager';
        }
        
        return '';
    }
}
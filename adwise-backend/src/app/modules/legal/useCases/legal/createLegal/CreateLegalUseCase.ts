import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { ILegal, LegalModel } from "../../../models/Legal";
import { ILegalRepo } from "../../../repo/legal/ILegalRepo";
import { ILegalValidationService } from "../../../services/legal/legalValidationService/ILegalValidationService";
import { GenerateOrganizationDocumentUseCase } from "../../organizationDocuments/generateOrganizationDocument/GenerateOrganizationDocumentUseCase";
import { CreateLegalDTO } from "./CreateLegalDTO";
import { createLegalErrors } from "./createLegalErrors";

interface IKeyObjects {
    user: IUser;
    organization: IOrganization;
    organizationLegal?: ILegal;
    legalWithInn?: ILegal;
};

export class CreateLegalUseCase implements IUseCase<CreateLegalDTO.Request, CreateLegalDTO.Response> {
    private userRepo: IUserRepo;
    private legalRepo: ILegalRepo;
    private organizationRepo: IOrganizationRepo;
    private legalValidationService: ILegalValidationService;
    private generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase;

    public errors = createLegalErrors;

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

    public async execute(req: CreateLegalDTO.Request): Promise<CreateLegalDTO.Response> {
        const valid = this.validateRequest(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.organizationId, req.userId, req.info.inn);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            organization,
            organizationLegal,
            legalWithInn,
            user
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        if (organizationLegal && req.relevant) {
            return Result.fail(UseCaseError.create('f', 'Legal already exists'));
        }

        if (legalWithInn && legalWithInn.organization.toString() != organization._id.toString()) {
            return Result.fail(UseCaseError.create('f', 'Organization with the same inn already exists'));
        }

        req.info.organizationName = this.normalizeOrganizationName(req.info.organizationName, req.form);

        const legal = new LegalModel({
            organization: organization._id,
            country: req.country,
            form: req.form,
            info: req.info,
            relevant: req.relevant
        });

        const legalSaved = await this.legalRepo.save(legal);
        if (legalSaved.isFailure) {
            console.log(legalSaved.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon saving legal'));
        }

        if (legal.relevant) {
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
            await this.generateOrganizationDocumentUseCase.execute({
                organizationId: organization._id.toString(),
                type: 'packetPaymentAct',
                userId: organization.user.toString()
            });
        }

        return Result.ok({legalId: legal._id.toString()});
    }

    private async getKeyObjects(organizationId: string, userId: string, inn: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const userFound = await this.userRepo.findById(userId);
        if (userFound.isFailure) {
            return Result.fail(userFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding user') : UseCaseError.create('m'));
        }

        const user = userFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let organizationLegal: ILegal | undefined;

        const organizationLegalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        if (organizationLegalFound.isSuccess) {
            organizationLegal = organizationLegalFound.getValue()!;
        }

        let legalWithInn: ILegal | undefined;

        const legalWithInnFound = await this.legalRepo.findByInnAndRelevant(inn, true);
        if (legalWithInnFound.isSuccess) {
            legalWithInn = legalWithInnFound.getValue()!;
        }

        return Result.ok({
            organization,
            organizationLegal,
            legalWithInn,
            user
        });
    }

    private validateRequest(req: CreateLegalDTO.Request): Result<string | null, string | null> {
        switch (req.form) {
            case 'individual':
                return this.legalValidationService.createIndividualLegal(req);
            case 'ip':
                return this.legalValidationService.createIpLegal(req);
            case 'ooo':
                return this.legalValidationService.createOOOLegal(req);
            default:
                return Result.fail('Invalid value for "form" path');
        }
    }

    private normalizeOrganizationName(organizationName: string, form: string): string {
        if (!organizationName) return organizationName;
        let formatted: string;

        switch (form) {
            case 'individual':
                formatted = organizationName.toLowerCase().replace(/(^|\s)сз($|\s)/ig, '').replace(/(^|\s)самозанятый($|\s)/ig, '').replace(/(^|\s)самозанятая($|\s)/ig, '').trim()
                return formatted.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
            case 'ip':
                formatted = organizationName.toLowerCase().replace(/(^|\s)ип($|\s)/ig, '').replace(/(^|\s)индивидуальный предприниматель($|\s)/ig, '').trim()
                return formatted.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
            case 'ooo':
                formatted = organizationName.toLowerCase().replace(/(^|\s)ооо($|\s)/ig, '').replace(/(^|\s)общество с ограниченной ответственностью($|\s)/ig, '').replace(/[\'\"]/ig, '').trim();
                return formatted.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
            default:
                return '';
        }
    }
}
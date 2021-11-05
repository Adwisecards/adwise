import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IPDFService } from "../../../../../services/pdfService/IPDFService";
import { UpdateLegalUseCase } from "../../../../legal/useCases/legal/updateLegal/UpdateLegalUseCase";
import { GenerateOrganizationDocumentUseCase } from "../../../../legal/useCases/organizationDocuments/generateOrganizationDocument/GenerateOrganizationDocumentUseCase";
import { ILegalInfoRequest } from "../../../models/LegalInfoRequest";
import { IOrganization } from "../../../models/Organization";
import { ILegalInfoRequestRepo } from "../../../repo/legalInfoRequests/ILegalInfoRequestRepo";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { CreateOrganizationNotificationUseCase } from "../../organizationNotifications/createOrganizationNotification/CreateOrganizationNotificationUseCase";
import { SatisfyLegalInfoRequestDTO } from "./SatisfyLegalInfoRequestDTO";
import { satisfyLegalInfoRequestErrors } from "./satisfyLegalInfoRequestErrors";

interface IKeyObjects {
    organization: IOrganization;
    legalInfoRequest: ILegalInfoRequest;
};

interface IDocuments {
    application: string;
    treaty: string;
};

export class SatisfyLegalInfoRequestUseCase implements IUseCase<SatisfyLegalInfoRequestDTO.Request, SatisfyLegalInfoRequestDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private updateLegalUseCase: UpdateLegalUseCase;
    private legalInfoRequestRepo: ILegalInfoRequestRepo;
    private generateOrganizationDocumentUseCaes: GenerateOrganizationDocumentUseCase;
    private createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase;

    public errors = satisfyLegalInfoRequestErrors;

    constructor(
        organizationRepo: IOrganizationRepo,
        updateLegalUseCase: UpdateLegalUseCase,
        legalInfoRequestRepo: ILegalInfoRequestRepo,
        generateOrganizationDocumentUseCaes: GenerateOrganizationDocumentUseCase,
        createOrganizationNotificationUseCase: CreateOrganizationNotificationUseCase
    ) {
        this.organizationRepo = organizationRepo;
        this.updateLegalUseCase = updateLegalUseCase;
        this.legalInfoRequestRepo = legalInfoRequestRepo;
        this.generateOrganizationDocumentUseCaes = generateOrganizationDocumentUseCaes;
        this.createOrganizationNotificationUseCase = createOrganizationNotificationUseCase;
    }

    public async execute(req: SatisfyLegalInfoRequestDTO.Request): Promise<SatisfyLegalInfoRequestDTO.Response> {
        if (!Types.ObjectId.isValid(req.legalInfoRequestId)) {
            return Result.fail(UseCaseError.create('c', 'legalInfoRequestId is not valid'));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.legalInfoRequestId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            legalInfoRequest,
            organization
        } = keyObjectsGotten.getValue()!;

        if (legalInfoRequest.satisfied) {
            return Result.fail(UseCaseError.create('c', 'Legal info request is already satisfied'));
        }

        if (legalInfoRequest.rejected) {
            return Result.fail(UseCaseError.create('c', 'Legal info request has been rejected'));
        }

        if (legalInfoRequest.legal) {
            const legalUpdated = await this.updateLegalUseCase.execute({
                legalId: legalInfoRequest.legal._id.toString(),
                userId: organization.user.toString()
            });
            
            if (legalUpdated.isFailure) {
                console.log(legalUpdated.getError());
                return Result.fail(UseCaseError.create('a', 'Error upon updating legal'));
            }
        }

        if (legalInfoRequest.name) organization.name = legalInfoRequest.name;
        if (legalInfoRequest.address) organization.address = legalInfoRequest.address;
        if (legalInfoRequest.category) organization.category = legalInfoRequest.category;

        if (legalInfoRequest.emails && legalInfoRequest.emails.length) organization.emails = legalInfoRequest.emails;
        if (legalInfoRequest.phones && legalInfoRequest.phones.length) organization.phones = legalInfoRequest.phones;

        legalInfoRequest.satisfied = true;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const legalInfoRequestSaved = await this.legalInfoRequestRepo.save(legalInfoRequest);
        if (legalInfoRequestSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving legal info request'));
        }

        const organizationNotificationCreated = await this.createOrganizationNotificationUseCase.execute({
            organizationId: legalInfoRequest.organization.toString(),
            type: 'legalInfoRequestSatisfied',
            legalInfoRequestId: legalInfoRequest._id.toString()
        });

        if (organizationNotificationCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating organization notification'));
        }

        await this.generateOrganizationDocumentUseCaes.execute({
            organizationId: organization._id.toString(),
            type: 'treaty',
            userId: organization.user.toString()
        });

        await this.generateOrganizationDocumentUseCaes.execute({
            organizationId: organization._id.toString(),
            type: 'application',
            userId: organization.user.toString()
        });

        await this.generateOrganizationDocumentUseCaes.execute({
            organizationId: organization._id.toString(),
            type: 'packetPaymentAct',
            userId: organization.user.toString()
        });

        return Result.ok({
             legalInfoRequestId: req.legalInfoRequestId
        });
    }

    private async getKeyObjects(legalInfoRequestId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const legalInfoRequestFound = await this.legalInfoRequestRepo.findById(legalInfoRequestId);
        if (legalInfoRequestFound.isFailure) {
            return Result.fail(legalInfoRequestFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal info request') : UseCaseError.create('a3'));
        }

        const legalInfoRequest = legalInfoRequestFound.getValue()!;

        const organizationFound = await this.organizationRepo.findById(legalInfoRequest.organization.toString());
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        return Result.ok({
            organization,
            legalInfoRequest
        });
    }
}
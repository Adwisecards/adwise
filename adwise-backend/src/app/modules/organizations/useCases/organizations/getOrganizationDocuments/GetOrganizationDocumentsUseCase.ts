import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IZipService, IZipServiceFile } from "../../../../../services/zipService/IZipService";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganization } from "../../../models/Organization";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { GetOrganizationDocumentsDTO } from "./GetOrganizationDocumentsDTO";
import { getOrganizationDocumentsErrors } from "./getOrganizationDocumentsErrors";

interface IKeyObjects {
    organization: IOrganization;
};

interface IDocuments {
    packetPaymentAct?: Buffer;
    application?: Buffer;
    treaty?: Buffer;
    lastFinancialReport?: Buffer;
};

export class GetOrganizationDocumentsUseCase implements IUseCase<GetOrganizationDocumentsDTO.Request, GetOrganizationDocumentsDTO.Response> {
    private zipService: IZipService;
    private mediaService: IMediaService;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;

    public errors = getOrganizationDocumentsErrors;

    constructor(
        zipService: IZipService,
        mediaService: IMediaService,
        organizationRepo: IOrganizationRepo,
        organizationValidationService: IOrganizationValidationService
    ) {
        this.zipService = zipService;
        this.mediaService = mediaService;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
    }

    public async execute(req: GetOrganizationDocumentsDTO.Request): Promise<GetOrganizationDocumentsDTO.Response> {
        const valid = this.organizationValidationService.getOrganizationDocumentsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.organizationId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            organization
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != req.userId) {
            return Result.fail(UseCaseError.create('d', 'User is not owner of the organization'));
        }

        const documentsGotten = await this.getDocuments(
            organization.application,
            organization.treaty,
            organization.packetPaymentAct,
            organization.lastFinancialReport
        );

        if (documentsGotten.isFailure) {
            return Result.fail(documentsGotten.getError());
        }

        const documents = Object.entries(documentsGotten.getValue()!);

        const zipFiles: IZipServiceFile[] = [];

        for (const [key, value] of documents) {
            if (!value) continue;

            zipFiles.push({
                data: value,
                filename: key+'.pdf'
            });
        }

        const zipCreated = this.zipService.createZip(zipFiles);
        if (zipCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating zip'));
        }

        const zip = zipCreated.getValue()!;

        return Result.ok({data: zip});
    }

    private async getDocuments(
        applicationUrl: string, 
        treatyUrl: string,
        packetPaymentActUrl: string,
        lastFinancialReportUrl: string
    ): Promise<Result<IDocuments | null, UseCaseError | null>> {
        const getFileName = (url: string): string => {
            if (url) {
                const parts = url.split('/'); 
                return parts[parts.length - 1];
            }
            
            return '';
        }

        console.log(applicationUrl, treatyUrl, packetPaymentActUrl, lastFinancialReportUrl);
        
        const documents: IDocuments = {};

        if (applicationUrl) {
            const applicationGotten = await this.mediaService.get(getFileName(applicationUrl));
            if (applicationGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting application'));
            }

            const application = applicationGotten.getValue()!;

            documents.application = application;
        }

        if (treatyUrl) {
            const treatyGotten = await this.mediaService.get(getFileName(treatyUrl));
            if (treatyGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting treaty'));
            }

            const treaty = treatyGotten.getValue()!;

            documents.treaty = treaty;
        }

        if (lastFinancialReportUrl) {
            const lastFinancialReportGotten = await this.mediaService.get(getFileName(lastFinancialReportUrl));
            if (lastFinancialReportGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting last financial report'));
            }

            const lastFinancialReport = lastFinancialReportGotten.getValue()!;

            documents.lastFinancialReport = lastFinancialReport;
        }

        if (lastFinancialReportUrl) {
            const lastFinancialReportGotten = await this.mediaService.get(getFileName(lastFinancialReportUrl));
            if (lastFinancialReportGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting last financial report'));
            }

            const lastFinancialReport = lastFinancialReportGotten.getValue()!;

            documents.lastFinancialReport = lastFinancialReport;
        }

        if (packetPaymentActUrl) {
            const packetPaymentActGotten = await this.mediaService.get(getFileName(packetPaymentActUrl));
            if (packetPaymentActGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting packet payment'));
            }

            const packetPaymentAct = packetPaymentActGotten.getValue()!;

            documents.packetPaymentAct = packetPaymentAct;
        }

        return Result.ok(documents);
    }

    private async getKeyObjects(organizationId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        return Result.ok({organization});
    }
}
import { Types } from "mongoose";
import { type } from "os";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IEmailService } from "../../../../../services/emailService/IEmailService";
import { IZipService, IZipServiceFile } from "../../../../../services/zipService/IZipService";
import { IGlobal } from "../../../../administration/models/Global";
import { IGlobalRepo } from "../../../../administration/repo/globals/IGlobalRepo";
import { GetMediaDataUseCase } from "../../../../media/useCases/getMediaData/GetMediaDataUseCase";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { IOrganizationDocument } from "../../../models/OrganizationDocument";
import { IOrganizationDocumentRepo } from "../../../repo/organizationDocuments/IOrganizationDocumentRepo";
import { GenerateOrganizationDocumentUseCase } from "../generateOrganizationDocument/GenerateOrganizationDocumentUseCase";
import { UpdateOrganizationWithdrawalActDocumentDTO } from "./UpdateOrganizationWithdrawalActDocumentDTO";
import { updateOrganizationWithdrawalActDocumentErrors } from "./updateOrganizationWithdrawalActDocumentErrors";
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { IPurchaseRepo } from "../../../../finance/repo/purchases/IPurchaseRepo";

interface IKeyObjects {
    organizations: IOrganization[];
    global: IGlobal;
};

export class UpdateOrganizationWithdrawalActDocumentUseCase implements IUseCase<UpdateOrganizationWithdrawalActDocumentDTO.Request, UpdateOrganizationWithdrawalActDocumentDTO.Response> {
    private globalRepo: IGlobalRepo;
    private zipService: IZipService;
    private emailService: IEmailService;
    private purchaseRepo: IPurchaseRepo;
    private organizationRepo: IOrganizationRepo;
    private getMediaDataUseCase: GetMediaDataUseCase;
    private organizationDocumentRepo: IOrganizationDocumentRepo;
    private generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase;

    public errors = updateOrganizationWithdrawalActDocumentErrors;
    
    constructor(
        globalRepo: IGlobalRepo,
        zipService: IZipService,
        emailService: IEmailService,
        purchaseRepo: IPurchaseRepo,
        organizationRepo: IOrganizationRepo,
        getMediaDataUseCase: GetMediaDataUseCase,
        organizationDocumentRepo: IOrganizationDocumentRepo,
        generateOrganizationDocumentUseCase: GenerateOrganizationDocumentUseCase
    ) {
        this.globalRepo = globalRepo;
        this.zipService = zipService;
        this.emailService = emailService;
        this.purchaseRepo = purchaseRepo;
        this.organizationRepo = organizationRepo;
        this.getMediaDataUseCase = getMediaDataUseCase;
        this.organizationDocumentRepo = organizationDocumentRepo;
        this.generateOrganizationDocumentUseCase = generateOrganizationDocumentUseCase;
    }

    public async execute(req: UpdateOrganizationWithdrawalActDocumentDTO.Request): Promise<UpdateOrganizationWithdrawalActDocumentDTO.Response> {
        const keyObjectsGotten = await this.getKeyObjects(req.organizationIds);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError());
        }

        const {
            organizations,
            global
        } = keyObjectsGotten.getValue()!;

        const organizationDocumentIds: string[] = [];

        for (const organization of organizations) {
            if (req.period) {
                for (let month = req.period; month >= 0; month--) {
                    const date = new Date();
                    date.setUTCMonth(date.getMonth() - month);
                    date.setUTCDate(15);
    
                    const result = await this.updateOrganizationWithdrawalActDocument(organization, date);
                    if (result.isSuccess) {
                        const id = result.getValue()!;
                        if (Types.ObjectId.isValid(id)) {
                            organizationDocumentIds.push(id);
                        }
                    }
                }
            } else {
                const result = await this.updateOrganizationWithdrawalActDocument(organization);
                console.log(result);
                if (result.isSuccess) {
                    const id = result.getValue()!;
                    if (Types.ObjectId.isValid(id)) {
                        organizationDocumentIds.push(id);
                    }
                }
            }
        }

        if (organizationDocumentIds.length) {
            const documentsSent = await this.sendOrganizationWithdrawalActDocuments(organizationDocumentIds, global);
            if (documentsSent.isFailure) {
                return Result.fail(documentsSent.getError()!);
            }
        }

        return Result.ok({
            organizationDocumentIds
        });
    }

    private async sendOrganizationWithdrawalActDocuments(organizationDocumentIds: string[], global: IGlobal): Promise<Result<boolean | null, UseCaseError | null>> {
        const organizationDocumentsFound = await this.organizationDocumentRepo.findByIds(organizationDocumentIds);
        if (organizationDocumentsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organization documents'));
        }

        const organizationDocuments = organizationDocumentsFound.getValue()!;

        const organizationIds = organizationDocuments.map(d => d.organization.toString());
        
        const mediaIds = organizationDocuments.map(d => d.documentMedia.toString());

        const zipFiles: IZipServiceFile[] = [];

        const cyrillicToTranslit = new CyrillicToTranslit();

        for (const i in mediaIds) {
            const mediaId = mediaIds[i];
            const organizationId = organizationIds[i];

            const mediaDataGotten = await this.getMediaDataUseCase.execute({
                mediaId: mediaId
            });

            if (mediaDataGotten.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting media data'));
            }

            const result = mediaDataGotten.getValue()!;

            const organizationFound = await this.organizationRepo.findById(organizationId);
            if (organizationFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon getting organization data'));
            }

            const organization = organizationFound.getValue()!;

            zipFiles.push({
                data: result.data,
                filename: `${cyrillicToTranslit.transform(organization.name, '_')}_withdrawal_act.pdf`
            });
        }

        const zipCreated = this.zipService.createZip(zipFiles);
        if (zipCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating zip'));
        }

        const zip = zipCreated.getValue()!;

        const emailSent = await this.emailService.sendToMultipleWithPlainText([global.contactEmail, ...global.spareContactEmails], 'withdrawalAct', {}, [{
            filename: 'withdrawal_acts.zip',
            data: zip
        }]);

        if (emailSent.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon sending email'));
        }

        return Result.ok(true);
    }

    private async updateOrganizationWithdrawalActDocument(organization: IOrganization, curr?: Date): Promise<Result<string | null, UseCaseError | null>> {    
        const date = curr ? new Date(curr) : new Date();

        let getLastDateOfMonth = (m: number, y: number) => m == 2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
        
        const dateFrom = curr ? new Date(curr) : new Date();
        dateFrom.setUTCHours(24,0,0,0);

        dateFrom.setUTCMonth(date.getMonth()-1);
        dateFrom.setUTCDate(1);

        const dateTo = new Date(dateFrom);
        dateTo.setUTCHours(24,0,0,0);
        
        dateTo.setUTCMonth(dateFrom.getMonth());
        dateTo.setUTCDate(getLastDateOfMonth(dateFrom.getMonth()+1, dateTo.getFullYear()));

        const purchasesCounted = await this.purchaseRepo.count(
            ['organization._id', 'dateFrom', 'dateTo'],
            [organization._id.toString(), dateFrom.toISOString(), dateTo.toISOString()]
        );

        if (purchasesCounted.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon counting purchases'));
        }

        const purchaseCount = purchasesCounted.getValue()!;

        if (purchaseCount == 0) {
            return Result.fail(UseCaseError.create('b', 'There is no purchases over the period'));
        }

        const organizationWithdrawalActDocumentFound = await this.organizationDocumentRepo.findByOrganizationAndTypeAndDateFromAndDateTo(organization._id.toString(), 'withdrawalAct', dateFrom, dateTo);

        if (organizationWithdrawalActDocumentFound.isFailure) {
            const organizationWithdrawalActDocumentGenerated = await this.generateOrganizationDocumentUseCase.execute({
                organizationId: organization._id.toString(),
                type: 'withdrawalAct',
                userId: organization?.user?.toString(),
                options: {
                    dateFrom: dateFrom.toISOString(),
                    dateTo: dateTo.toISOString()
                },
                asNew: true
            });

            if (organizationWithdrawalActDocumentGenerated.isFailure) {
                console.log(organizationWithdrawalActDocumentGenerated.getError()!);
                return Result.fail(UseCaseError.create('a', 'Error upon generating organization withdrawal act document'));
            }

            const { organizationDocumentId } = organizationWithdrawalActDocumentGenerated.getValue()!;
            return Result.ok(organizationDocumentId);
        }

        return Result.fail(UseCaseError.create('d', 'Withdrawal act is already updated'));
    }

    private async getKeyObjects(organizationIds?: string[]): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        let organizations: IOrganization[];

        if (organizationIds && organizationIds.length) {
            const organizationsFound = await this.organizationRepo.findByIds(organizationIds);
            if (organizationsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
            }

            organizations = organizationsFound.getValue()!;
        } else {
            const organizationsFound = await this.organizationRepo.getAll();
            if (organizationsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
            } 

            organizations = organizationsFound.getValue()!;
        }

        const globalGotten = await this.globalRepo.getGlobal()!;
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        return Result.ok({
            organizations,
            global
        });
    }
}
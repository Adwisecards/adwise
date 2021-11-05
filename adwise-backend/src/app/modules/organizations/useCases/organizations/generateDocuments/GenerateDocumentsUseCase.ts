import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IMediaService } from "../../../../../services/mediaService/IMediaService";
import { IPDFService } from "../../../../../services/pdfService/IPDFService";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganization } from "../../../models/Organization";
import { IPacket } from "../../../models/Packet";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { GenerateDocumentsDTO } from "./GenerateDocumentsDTO";
import { generateDocumentsErrors } from "./generateDocumentsErrors";

interface IKeyObjects {
    organization: IOrganization;
    manager?: IUser;
};

interface IDocuments {
    packetPaymentActUrl: string;
    applicationUrl: string;
    treatyUrl: string;
};

export class GenerateDocumentsUseCase implements IUseCase<GenerateDocumentsDTO.Request, GenerateDocumentsDTO.Response> {
    private userRepo: IUserRepo;
    private pdfService: IPDFService;
    private mediaService: IMediaService;
    private organizationRepo: IOrganizationRepo;
    private organizationValidationService: IOrganizationValidationService;

    public errors = generateDocumentsErrors;

    constructor(
        userRepo: IUserRepo,
        pdfService: IPDFService,
        mediaService: IMediaService,
        organizationRepo: IOrganizationRepo,
        organizationValidationService: IOrganizationValidationService
    ) {
        this.userRepo = userRepo;
        this.pdfService = pdfService;
        this.mediaService = mediaService;
        this.organizationRepo = organizationRepo;
        this.organizationValidationService = organizationValidationService;
    }

    public async execute(req: GenerateDocumentsDTO.Request): Promise<GenerateDocumentsDTO.Response> {
        const valid = this.organizationValidationService.generateDocumentsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.organizationId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            organization,
            manager
        } = keyObjectsGotten.getValue()!;

        const documentsGenerated = await this.generateDocuments(organization, manager);
        if (documentsGenerated.isFailure) {
            return Result.fail(documentsGenerated.getError()!);
        }

        const documents = documentsGenerated.getValue()!;

        if (documents.applicationUrl) {
            organization.application = documents.applicationUrl;
        }

        if (documents.packetPaymentActUrl) {
            organization.packetPaymentAct = documents.packetPaymentActUrl;
        }

        if (documents.treatyUrl) {
            organization.treaty = documents.treatyUrl;
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        return Result.ok({
            organizationId: req.organizationId
        });
    }

    private async generateDocuments(organization: IOrganization, manager?: IUser): Promise<Result<IDocuments | null, UseCaseError | null>> {
        const date = new Date();
        
        const documents: IDocuments = {
            applicationUrl: '',
            packetPaymentActUrl: '',
            treatyUrl: ''
        };
        
        if (organization.legal?.info) {
            const applicationGenerated = await this.pdfService.generatePDF(organization.legal.form, {
                ...organization.legal.info,
                packetName: organization.packet?.name || organization.requestedPacket?.name ||  '-',
                managerCode: manager?.ref.code || '-'
            });

            if (applicationGenerated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon generating application'));
            }

            const application = applicationGenerated.getValue()!;

            const applicationSaved = await this.mediaService.save(`organization_application_${date.toISOString()}.pdf`, application);
            if (applicationSaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving application'));
            }

            documents.applicationUrl = applicationSaved.getValue()!;

            const treatyGenerated = await this.pdfService.generatePDF(`treaty`, organization.legal.info);
            if (treatyGenerated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon generating treaty'));
            }

            const treaty = treatyGenerated.getValue()!;

            const treatySaved = await this.mediaService.save(`organization_treaty_${date.toISOString()}.pdf`, treaty);
            if (treatySaved.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon saving treaty'));
            }

            documents.treatyUrl = treatySaved.getValue()!;
        }

        if (organization.packet && organization.legal?.info) {
            const packetPaymentActName = this.getPacketPaymentActName(organization.legal.form, organization.packet);
            if (packetPaymentActName) {
                const packetPaymentActGenerated = await this.pdfService.generatePDF(packetPaymentActName, {
                    fullName: organization.legal.info?.fullName,
                            
                    packetDateFromDate: organization.packet.timestamp.getDate(),
                    packetDateFromMonth: this.formatMonth(organization.packet.timestamp.getMonth()),
                    packetDateFromYear: organization.packet.timestamp.getFullYear(),
                    packetDateToDate: organization.packet.timestamp.getDate(),
                    packetDateToMonth: this.formatMonth(organization.packet.timestamp.getMonth()),
                    packetDateToYear: organization.packet.timestamp.getFullYear()+1,
        
                    ceoFullName: `${organization.legal.info?.ceoLastName || '_'} ${organization.legal.info?.ceoFirstName || '_'} ${organization.legal.info?.ceoMiddleName || '_'}` || '_',
                
                    inn: organization.legal.info?.inn,
                    kpp: organization.legal.info?.kpp,
                    ogrn: organization.legal.info?.orgn
                });
    
                if (packetPaymentActGenerated.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon generating packet payment act'));
                }

                const packetPaymentAct = packetPaymentActGenerated.getValue()!;

                const packetPaymentActSaved = await this.mediaService.save(`organization_packet_payment_act_${date.toISOString()}.pdf`, packetPaymentAct);
                if (packetPaymentActSaved.isFailure) {
                    return Result.fail(UseCaseError.create('a', 'Error upon saving packet payment act'));
                }

                documents.packetPaymentActUrl = packetPaymentActSaved.getValue()!;
            }
        }

        return Result.ok(documents);
    }

    private formatMonth(month: number): string {
        const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

        return months[month];
    }

    private getPacketPaymentActName(legalForm: string, packet: IPacket): string {
        if (legalForm == 'ip' && packet.name.toLowerCase() == 'promo' && packet.asWisewinOption) {
            return 'promo25002IpWisewin';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'promo' && packet.asWisewinOption) {
            return 'promo25002IndividualWisewin';
        }

        if (legalForm == 'ip' && packet.name.toLowerCase() == 'one' && packet.asWisewinOption) {
            return 'one400012IpWisewin';
        }

        if (legalForm == 'jp' && packet.name.toLowerCase() == 'one' && packet.asWisewinOption) {
            return 'one400012JpWisewin';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'one' && packet.asWisewinOption) {
            return 'one400012IndividualWisewin';
        }
        
        if (legalForm == 'ip' && packet.name.toLowerCase() == 'full') {
            return 'full1200012Ip';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'full') {
            return 'full1200012Individual';
        }

        if (legalForm == 'jp' && packet.name.toLowerCase() == 'full') {
            return 'full1200012Jp';
        }

        if (legalForm == 'ip' && packet.name.toLowerCase() == 'one') {
            return 'one400012Ip';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'one') {
            return 'one400012Individual';
        }

        if (legalForm == 'Jp' && packet.name.toLowerCase() == 'one') {
            return 'one400012Jp';
        }

        if (legalForm == 'ip' && packet.name.toLowerCase() == 'promo') {
            return 'promo25002Ip';
        }

        if (legalForm == 'individual' && packet.name.toLowerCase() == 'promo') {
            return 'promo25002Individual';
        }

        if (legalForm == 'jp' && packet.name.toLowerCase() == 'promo') {
            return 'promo25002Jp';
        }

        return '';
    }

    private async getKeyObjects(organizationId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const organizationFound = await this.organizationRepo.findById(organizationId);
        if (organizationFound.isFailure) {
            return Result.fail(organizationFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding organization') : UseCaseError.create('l'));
        }

        const organization = organizationFound.getValue()!;

        let manager: IUser | undefined;

        if (organization.manager) {
            const managerFound = await this.userRepo.findById(organization.manager.toString());
            if (managerFound.isFailure) {
                return Result.fail(managerFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding manager') : UseCaseError.create('m'));
            }

            manager = managerFound.getValue()!;
        }

        return Result.ok({
            organization,
            manager
        });
    }
}
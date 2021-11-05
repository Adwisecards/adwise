import MyRegexp from "myregexp";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IOrganization } from "../../../../organizations/models/Organization";
import { IOrganizationRepo } from "../../../../organizations/repo/organizations/IOrganizationRepo";
import { ILegal, LegalModel } from "../../../models/Legal";
import { IIndividualLegalInfo } from "../../../models/legalInfo/IndividualLegalInfo";
import { IIpLegalInfo } from "../../../models/legalInfo/IpLegalInfo";
import { IOOOLegalInfo } from "../../../models/legalInfo/OOOLegalInfo";
import { ILegalRepo } from "../../../repo/legal/ILegalRepo";
import { CreateLegalUseCase } from "../createLegal/CreateLegalUseCase";
import { CreateLegalsFromOrganizationsDTO } from "./CreateLegalsFromOrganizationsDTO";
import { createLegalsFromOrganizationsErrors } from "./createLegalsFromOrganizationsErrors";

interface IKeyObjects {
    organizations: IOrganization[];
};

export class CreateLegalsFromOrganizationsUseCase implements IUseCase<CreateLegalsFromOrganizationsDTO.Request, CreateLegalsFromOrganizationsDTO.Response> {
    private legalRepo: ILegalRepo;
    private organizationRepo: IOrganizationRepo;
    private createLegalUseCase: CreateLegalUseCase;

    public errors = createLegalsFromOrganizationsErrors;

    constructor(
        legalRepo: ILegalRepo,
        organizationRepo: IOrganizationRepo,
        createLegalUseCase: CreateLegalUseCase
    ) {
        this.legalRepo = legalRepo
        this.organizationRepo = organizationRepo;
        this.createLegalUseCase = createLegalUseCase;
    }

    public async execute(_: CreateLegalsFromOrganizationsDTO.Request): Promise<CreateLegalsFromOrganizationsDTO.Response> {
        const keyObjectsGotten = await this.getKeyObjects();
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            organizations
        } = keyObjectsGotten.getValue()!;

        const legalIds: string[] = [];

        for (const organization of organizations) {
            const result = await this.createLegalFromOrganization(organization);
            if (result.isSuccess) {
                legalIds.push(result.getValue()!);
            }
        }

        return Result.ok({legalIds});
    }

    private async createLegalFromOrganization(organization: IOrganization): Promise<Result<string | null, UseCaseError | null>> {
        if (!organization.legal?.info) {
            return Result.fail(UseCaseError.create('c', 'Not enough legal information'));
        }

        let legalInfo: IIpLegalInfo | IIndividualLegalInfo | IOOOLegalInfo;

        switch (organization.legal.form) {
            case 'individual':
                legalInfo = this.createIndividualLegalInfo(organization.legal.info);
                break;
            case 'ip':
                legalInfo = this.createIpLegalInfo(organization.legal.info);
                break;
            case 'ooo':
                legalInfo = this.createOOOLegalInfo(organization.legal.info);
                break;
        }

        const legalCreated = await this.createLegalUseCase.execute({
            country: organization.legal.country,
            form: organization.legal.form,
            info: legalInfo!,
            organizationId: organization._id.toString(),
            userId: organization.user.toString(),
            relevant: true
        });

        if (legalCreated.isFailure) {
            console.log(legalInfo!);
            console.log(legalCreated.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon creating legal'));
        }

        const { legalId } = legalCreated.getValue()!;

        return Result.ok(legalId);
    }

    private createIndividualLegalInfo(info: any): IIndividualLegalInfo {
        return {
            organizationName: info.fullName || info.organizationName || info.name || '',
            email: info.emailAddress || info.email || '',
            phone: this.formatPhone(info.phoneNumber || info.phone || ''),
            siteUrl: info.siteUrl || '',
            inn: info.inn || '',
            ogrn: info.ogrn || info.ogrnip || '',
            citizenship: info.ceoCitizenship || info.founderCitizenship || 'Россия',
            dob: this.formatDate(info.dob || info.ceoBirthDate || info.founderBirthDate || ''),
            pob: info.ceoBirthPlace || info.founderBirthPlace || '',
            document: {
                departmentCode: info.identityDocumentDepartmentCode || '',
                issueDate: this.formatDate(info.identityDocumentDateIssue || info.ceoIssueDate || info.founderIssuedBy || ''),
                issuedBy: info.identityDocumentIssuedBy || info.ceoIssuedBy || info.founderIssuedBy || '',
                serialNumber: info.identityDocumentSerialNumber || info.ceoDocNumber || info.founderDocNumber || '',
                type: info.identityDocument || info.ceoDocType || info.founderDocType || 'Паспорт'
            },
            bankAccount: {
                account: info.bankAccount_account || info.bankAccount?.account || '',
                bik: info.bankAccount_bik || info.bankAccount?.bik || '',
                korAccount: info.bankAccount_korAccount || info.bankAccount?.korAccount || '',
                name: info.bankAccount_bankName || info.bankAccount?.bankName || ''
            },
            addresses: {
                legal: {
                    city: info.addresses_city || (info.addresses?.length ? info.addresses[0]?.city : '') || '',
                    country: info.addresses_country?.toLowerCase() || (info.addresses?.length ? info.addresses[0]?.country : '') || '',
                    street: info.addresses_street || (info.addresses?.length ? info.addresses[0]?.street : '') || '',
                    zip: info.addresses_zip || (info.addresses?.length ? info.addresses[0]?.zip : '') || ''
                },
                mailing: {
                    city: info.addresses_city || (info.addresses?.length ? info.addresses[0]?.city : '') || '',
                    country: info.addresses_country?.toLowerCase() || (info.addresses?.length ? info.addresses[0]?.country : '') || '',
                    street: info.addresses_street || (info.addresses?.length ? info.addresses[0]?.street : '') || '',
                    zip: info.addresses_zip || (info.addresses?.length ? info.addresses[0]?.zip : '') || ''
                }
            }
        };
    }

    private createIpLegalInfo(info: any): IIpLegalInfo {
        return {
            organizationName: info.fullName || info.organizationName || info.name || '',
            email: info.emailAddress || info.email || '',
            phone: this.formatPhone(info.phoneNumber || info.phone || ''),
            siteUrl: info.siteUrl || '',
            inn: info.inn || '',
            kpp: info.kpp || '',
            ogrn: info.ogrn || info.ogrnip || '',
            billingDescriptor: info.billingDescriptor || '',
            bankAccount: {
                account: info.bankAccount_account || info.bankAccount?.account || '',
                bik: info.bankAccount_bik || info.bankAccount?.bik || '',
                korAccount: info.bankAccount_korAccount || info.bankAccount?.korAccount || '',
                name: info.bankAccount_bankName || info.bankAccount?.bankName || ''
            },
            addresses: {
                legal: {
                    city: info.addresses_city || (info.addresses?.length ? info.addresses[0]?.city : '') || '',
                    country: info.addresses_country?.toLowerCase() || (info.addresses?.length ? info.addresses[0]?.country : '') || '',
                    street: info.addresses_street || (info.addresses?.length ? info.addresses[0]?.street : '') || '',
                    zip: info.addresses_zip || (info.addresses?.length ? info.addresses[0]?.zip : '') || ''
                },
                mailing: {
                    city: info.addresses_city || (info.addresses?.length ? info.addresses[0]?.city : '') || '',
                    country: info.addresses_country?.toLowerCase() || (info.addresses?.length ? info.addresses[0]?.country : '') || '',
                    street: info.addresses_street || (info.addresses?.length ? info.addresses[0]?.street : '') || '',
                    zip: info.addresses_zip || (info.addresses?.length ? info.addresses[0]?.zip : '') || ''
                }
            },
            ceo: {
                address: info.ceoAddress || info.founderAddress || '',
                citizenship: info.ceoCitizenship || info.founderCitizenship || '',
                dob: this.formatDate(info.dob || info.ceoBirthDate || info.founderBirthDate || ''),
                pob: info.ceoBirthPlace || info.founderBirthPlace || '',
                document: {
                    departmentCode: info.identityDocumentDepartmentCode || '',
                    issueDate: this.formatDate(info.identityDocumentDateIssue || info.ceoIssueDate || info.founderIssuedBy || ''),
                    issuedBy: info.identityDocumentIssuedBy || info.ceoIssuedBy || info.founderIssuedBy || '',
                    serialNumber: info.identityDocumentSerialNumber || info.ceoDocNumber || info.founderDocNumber || '',
                    type: info.identityDocument || info.ceoDocType || info.founderDocType || 'Паспорт'
                },
                firstName: info.ceoFirstName || info.founderFirstName || '',
                lastName: info.ceoLastName || info.founderLastName || '',
                middleName: info.ceoMiddleName || info.founderMiddleName || '',
                phone: this.formatPhone(info.ceoPhone || info.founderPhone || info.phone || info.phoneNumber || '')
            }
        };
    }

    private createOOOLegalInfo(info: any): IOOOLegalInfo {
        return {
            organizationName: info.fullName || info.organizationName || info.name || '',
            email: info.emailAddress || info.email || '',
            phone: this.formatPhone(info.phoneNumber || info.phone || ''),
            siteUrl: info.siteUrl || '',
            inn: info.inn || '',
            kpp: info.kpp || '',
            ogrn: info.ogrn || info.ogrnip || '',
            billingDescriptor: info.billingDescriptor || '',
            bankAccount: {
                account: info.bankAccount_account || info.bankAccount?.account || '',
                bik: info.bankAccount_bik || info.bankAccount?.bik || '',
                korAccount: info.bankAccount_korAccount || info.bankAccount?.korAccount || '',
                name: info.bankAccount_bankName || info.bankAccount?.bankName || ''
            },
            addresses: {
                legal: {
                    city: info.addresses_city || (info.addresses?.length ? info.addresses[0]?.city : '') || '',
                    country: info.addresses_country?.toLowerCase() || (info.addresses?.length ? info.addresses[0]?.country : '') || '',
                    street: info.addresses_street || (info.addresses?.length ? info.addresses[0]?.street : '') || '',
                    zip: info.addresses_zip || (info.addresses?.length ? info.addresses[0]?.zip : '') || ''
                },
                mailing: {
                    city: info.addresses_city || (info.addresses?.length ? info.addresses[0]?.city : '') || '',
                    country: info.addresses_country?.toLowerCase() || (info.addresses?.length ? info.addresses[0]?.country : '') || '',
                    street: info.addresses_street || (info.addresses?.length ? info.addresses[0]?.street : '') || '',
                    zip: info.addresses_zip || (info.addresses?.length ? info.addresses[0]?.zip : '') || ''
                }
            },
            ceo: {
                address: info.ceoAddress || info.founderAddress || '',
                citizenship: info.ceoCitizenship || info.founderCitizenship || '',
                dob: this.formatDate(info.ceoBirthDate || info.founderBirthDate || info.dob || ''),
                pob: info.ceoBirthPlace || info.founderBirthPlace || '',
                document: {
                    departmentCode: info.identityDocumentDepartmentCode || '',
                    issueDate: this.formatDate(info.identityDocumentDateIssue || info.ceoIssueDate || info.founderIssuedBy || ''),
                    issuedBy: info.identityDocumentIssuedBy || info.ceoIssuedBy || info.founderIssuedBy || '',
                    serialNumber: info.identityDocumentSerialNumber || info.ceoDocNumber || info.founderDocNumber || '',
                    type: info.identityDocument || info.ceoDocType || info.founderDocType || 'Паспорт'
                },
                firstName: info.ceoFirstName || info.founderFirstName || '',
                lastName: info.ceoLastName || info.founderLastName || '',
                middleName: info.ceoMiddleName || info.founderMiddleName || '',
                phone: this.formatPhone(info.ceoPhone || info.founderPhone || info.phone || info.phoneNumber || '')
            },
            founder: {
                address: info.founderAddress || info.ceoAddress || '',
                citizenship: info.founderCitizenship || info.ceoCitizenship || '',
                dob: this.formatDate(info.founderBirthDate || info.ceoBirthDate || info.dob || ''),
                pob: info.founderBirthPlace || info.ceoBirthPlace || '',
                document: {
                    departmentCode: info.identityDocumentDepartmentCode || '',
                    issueDate: this.formatDate(info.identityDocumentDateIssue || info.ceoIssueDate || info.founderIssuedBy || ''),
                    issuedBy: info.identityDocumentIssuedBy || info.ceoIssuedBy || info.founderIssuedBy || '',
                    serialNumber: info.identityDocumentSerialNumber || info.ceoDocNumber || info.founderDocNumber || '',
                    type: info.identityDocument || info.ceoDocType || info.founderDocType || 'Паспорт'
                },
                firstName: info.founderFirstName || info.ceoFirstName || '',
                lastName: info.founderLastName || info.ceoLastName || '',
                middleName: info.founderMiddleName || info.ceoMiddleName || '',
                phone: this.formatPhone(info.founderPhone || info.ceoPhone || info.phone || info.phoneNumber || '')
            }
        };
    }

    private formatPhone(phone: string): string {
        phone = phone.replace(MyRegexp.phoneFormat(), '');
        if (MyRegexp.phone().test(phone)) {
            return phone;
        } else {
            return '';
        }
    }

    private formatDate(date: string): any {
        console.log('date', date);
        if (date?.includes('.')) {
            const formattedDate = date?.split('.').reverse().join('-');
            console.log('formattedDate', formattedDate);
            return formattedDate ? new Date(formattedDate) : '';
        } else {
            return date || '';
        }
    }

    private async getKeyObjects(): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
        const organizationsFound = await this.organizationRepo.getAll();
        if (organizationsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding organizations'));
        }

        const organizations = organizationsFound.getValue()!;

        return Result.ok({
            organizations
        });
    }
}
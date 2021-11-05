import { Result } from "../../../../app/core/models/Result";
import { UseCaseError } from "../../../../app/core/models/UseCaseError";
import { IGlobal } from "../../../../app/modules/administration/models/Global";
import { IGlobalRepo } from "../../../../app/modules/administration/repo/globals/IGlobalRepo";
import { SetOrganizationGlobalUseCase } from "../../../../app/modules/administration/useCases/globals/setOrganizationGlobal/SetOrganizationGlobalUseCase";
import { ILegal } from "../../../../app/modules/legal/models/Legal";
import { ILegalRepo } from "../../../../app/modules/legal/repo/legal/ILegalRepo";
import { CreateLegalDTO } from "../../../../app/modules/legal/useCases/legal/createLegal/CreateLegalDTO";
import { CreateLegalUseCase } from "../../../../app/modules/legal/useCases/legal/createLegal/CreateLegalUseCase";
import { IOrganization } from "../../../../app/modules/organizations/models/Organization";
import { IOrganizationRepo } from "../../../../app/modules/organizations/repo/organizations/IOrganizationRepo";

interface ISetOrganizationObjects {
    global: IGlobal;
    organization: IOrganization;
    legal: ILegal;
};

export class SetOrganizationTest {
    private legalRepo: ILegalRepo;
    private globalRepo: IGlobalRepo;
    private organizationRepo: IOrganizationRepo;
    private createLegalUseCase: CreateLegalUseCase;
    private setOrganizationGlobalUseCase: SetOrganizationGlobalUseCase;

    constructor(
        legalRepo: ILegalRepo,
        globalRepo: IGlobalRepo,
        organizationRepo: IOrganizationRepo,
        createLegalUseCase: CreateLegalUseCase,
        setOrganizationGlobalUseCase: SetOrganizationGlobalUseCase
    ) {
        this.legalRepo = legalRepo;
        this.globalRepo = globalRepo;
        this.organizationRepo = organizationRepo;
        this.createLegalUseCase = createLegalUseCase;
        this.setOrganizationGlobalUseCase = setOrganizationGlobalUseCase;
    }

    public async execute(organization: IOrganization): Promise<Result<ISetOrganizationObjects | null, UseCaseError | null>> {
        const legalData: CreateLegalDTO.Request = {
            country: 'rus',
            form: 'ip',
            organizationId: organization._id.toString(),
            userId: organization.user.toString(),
            relevant: true,
            info: {
                "organizationName": "ООО Ситис",
                "inn": "6679028543",
                "kpp": "667901001",
                "ogrn": "1136679001854",
                "siteUrl": "http://localhost:5000/index.html",
                "billingDescriptor": "SITIS",
                "phone": "79915536512",
                "email": "ipbsa@gmail.com",
                "addresses": {
                    "legal": {
                        "country": "rus",
                        "city": "г. Санкт-Петербург",
                        "street": "ул. Ленина д. 55 кв 8",
                        "zip": "443321"
                    },
                    "mailing": {
                        "country": "rus",
                        "city": "г. Санкт-Петербург",
                        "street": "ул. Ленина д. 55 кв 8",
                        "zip": "443321"
                    }
                },
                "bankAccount": {
                    "account": "40702810202270000433",
                    "name": "ТОЧКА ПАО БАНКА ФК ОТКРЫТИЕ г Москва",
                    "bik": "044525999",
                    "korAccount": "30101810845250000999"
                },
                "ceo": {
                    "firstName": "Евгений",
                    "lastName": "Приходько",
                    "middleName": "Сергеевич",
                    "address": "Свердловская обл., г. Екатеринбург, ул. Родонитовая, д. 17, кв. 21",
                    "dob": "1984-02-15",
                    "pob": "Свердловская обл., г. Екатеринбург, ул. Родонитовая, д. 17, кв. 21",
                    "citizenship": "Россия",
                    "document": {
                        "type": "Паспорт",
                        "issueDate": "2004-03-29",
                        "issuedBy": "МВД Ленинского района г. Санкт-Петербург",
                        "serialNumber": "12345567",
                        "departmentCode": "12355666"
                    },
                    "phone": "79915536512"
                }
            }
        };

        const legalCreated = await this.createLegalUseCase.execute(legalData);
        if (legalCreated.isFailure) {
            return Result.fail(legalCreated.getError());
        }

        const { legalId } = legalCreated.getValue()!;

        const legalFound = await this.legalRepo.findById(legalId);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', 'Error upon finding legal') : UseCaseError.create('b4', 'Legal does not exist'));
        }

        const legal = legalFound.getValue()!;

        if (!legal.organization) {
            return Result.fail(UseCaseError.create('c', 'Legal does not point to no organization'));
        }

        if (legal.organization.toString() != organization._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Legal pointing to incorrect organization'));
        }

        organization.online = true;
        organization.disabled = false;
        organization.signed = true;
        organization.cash = true;

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const organizationSetGlobal = await this.setOrganizationGlobalUseCase.execute({
            organizationId: organization._id.toString()
        });
        
        if (organizationSetGlobal.isFailure) {
            return Result.fail(organizationSetGlobal.getError());
        }

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        if (!global.organization) {
            return Result.fail(UseCaseError.create('c', 'Global does not point to no global organization'));
        }

        if (global.organization.toString() != organization._id.toString()) {
            return Result.fail(UseCaseError.create('c', 'Global pointing to incorrect organization'));
        }

        return Result.ok({global, legal, organization});
    }
}
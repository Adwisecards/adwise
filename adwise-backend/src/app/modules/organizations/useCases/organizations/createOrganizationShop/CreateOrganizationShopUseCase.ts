import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { configProps } from "../../../../../services/config";
import { IPaymentService, IRegistrationData } from "../../../../../services/paymentService/IPaymentService";
import { ILegal } from "../../../../legal/models/Legal";
import { IIpLegalInfo } from "../../../../legal/models/legalInfo/IpLegalInfo";
import { IOOOLegalInfo } from "../../../../legal/models/legalInfo/OOOLegalInfo";
import { ILegalRepo } from "../../../../legal/repo/legal/ILegalRepo";
import { IUser } from "../../../../users/models/User";
import { IUserRepo } from "../../../../users/repo/users/IUserRepo";
import { IOrganization } from "../../../models/Organization";
import { IOrganizationRepo } from "../../../repo/organizations/IOrganizationRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { createOrganizationErrors } from "../createOrganization/createOrganizationErrors";
import { CreateOrganizationShopDTO } from "./CreateOrganizationShopDTO";

interface IKeyObjects {
    organization: IOrganization;
    legal: ILegal;
    user: IUser;
};

export class CreateOrganizationShopUseCase implements IUseCase<CreateOrganizationShopDTO.Request, CreateOrganizationShopDTO.Response> {
    private organizationRepo: IOrganizationRepo;
    private paymentService: IPaymentService;
    private organizationValidationService: IOrganizationValidationService;
    private legalRepo: ILegalRepo;
    private userRepo: IUserRepo;

    public errors = createOrganizationErrors;

    constructor(
        organizationRepo: IOrganizationRepo, 
        paymentService: IPaymentService, 
        organizationValidationService: IOrganizationValidationService,
        legalRepo: ILegalRepo,
        userRepo: IUserRepo
    ) {
        this.organizationRepo = organizationRepo;
        this.paymentService = paymentService;
        this.organizationValidationService = organizationValidationService;
        this.legalRepo = legalRepo;
        this.userRepo = userRepo;
    }

    public async execute(req: CreateOrganizationShopDTO.Request): Promise<CreateOrganizationShopDTO.Response> {
        const valid = this.organizationValidationService.createOrganizationShopData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const keyObjectsGotten = await this.getKeyObjects(req.organizationId, req.userId);
        if (keyObjectsGotten.isFailure) {
            return Result.fail(keyObjectsGotten.getError()!);
        }

        const {
            legal,
            organization,
            user
        } = keyObjectsGotten.getValue()!;

        if (organization.user.toString() != user._id.toString()) {
            return Result.fail(UseCaseError.create('d', 'User is not organization owner'));
        }

        if (legal.paymentShopId) {
            return Result.fail(UseCaseError.create('f', 'Organization already has an active shop on legal'));
        }

        const shopInfo: IRegistrationData = {
            addresses: [{
                city: legal.info.addresses.legal.city,
                country: legal.info.addresses.legal.country.toUpperCase() as any,
                street: legal.info.addresses.legal.street,
                type: 'legal',
                zip: legal.info.addresses.legal.zip
            }],
            bankAccount: {
                account: legal.info.bankAccount.account,
                bankName: legal.info.bankAccount.name,
                bik: legal.info.bankAccount.bik,
                details: 'bankAccount',
                korAccount: legal.info.bankAccount.korAccount,
                tax: 0
            },
            billingDescriptor: (<any>legal.info).billingDescriptor,
            ceo: {
                birthDate: (<IIpLegalInfo>legal.info).ceo.dob.toISOString(),
                firstName: (<IIpLegalInfo>legal.info).ceo.firstName,
                lastName: (<IIpLegalInfo>legal.info).ceo.lastName,
                middleName: (<IIpLegalInfo>legal.info).ceo.middleName,
                phone: (<IIpLegalInfo>legal.info).ceo.phone
            },
            email: legal.info.email,
            phones: [{
                phone: legal.info.phone,
                type: 'common'
            }],
            fullName: legal.info.organizationName,
            inn: legal.info.inn,
            kpp: (<IIpLegalInfo>legal.info).kpp,
            ogrn: legal.info.ogrn,
            name: legal.info.organizationName,
            shopArticleId: new Types.ObjectId().toString(),
            siteUrl: legal.info.siteUrl || `${configProps.frontendUrl}/organization/${organization._id}`
        };

        const shopCreated = await this.paymentService.createShop(shopInfo);
        if (shopCreated.isFailure) {
            console.log(shopCreated.getError());
            return Result.fail(UseCaseError.create('a', shopCreated.getError()!.message));
        }

        const shop = shopCreated.getValue()!;

        organization.paymentShopId = shop.shopCode.toString();

        if (organization.paymentShopId) {
            legal.paymentShopId = shop.shopCode.toString();
        }

        const organizationSaved = await this.organizationRepo.save(organization);
        if (organizationSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving organization'));
        }

        const legalSaved = await this.legalRepo.save(legal);
        if (legalSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding legal'));
        }

        return Result.ok({organizationId: organization._id});
    }

    private async getKeyObjects(organizationId: string, userId: string): Promise<Result<IKeyObjects | null, UseCaseError | null>> {
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

        const legalFound = await this.legalRepo.findByOrganizationAndRelevant(organization._id.toString(), true);
        console.log(legalFound);
        if (legalFound.isFailure) {
            return Result.fail(legalFound.getError()!.code == 500 ? UseCaseError.create('a', "Error upon finding legal") : UseCaseError.create('b4'));
        }

        const legal = legalFound.getValue()!;

        return Result.ok({
            legal,
            organization,
            user
        });
    }
}
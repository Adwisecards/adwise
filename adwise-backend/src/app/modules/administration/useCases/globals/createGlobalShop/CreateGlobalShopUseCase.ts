import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { configProps } from "../../../../../services/config";
import { IPaymentService, IRegistrationData } from "../../../../../services/paymentService/IPaymentService";
import { IGlobalRepo } from "../../../repo/globals/IGlobalRepo";
import { IAdministrationValidationService } from "../../../services/administrationValidationService/IAdministrationValidationService";
import { CreateGlobalShopDTO } from "./CreateGlobalShopDTO";
import { createGlobalShopErrors } from "./createGlobalShopErrors";
import { v4 } from 'uuid';
import { Types } from "mongoose";

export class CreateGlobalShopUseCase implements IUseCase<CreateGlobalShopDTO.Request, CreateGlobalShopDTO.Response> {
    private globalRepo: IGlobalRepo;
    private paymentService: IPaymentService;
    private administrationValidationSerivce: IAdministrationValidationService;

    public errors = createGlobalShopErrors;

    constructor(globalRepo: IGlobalRepo, paymentService: IPaymentService, administrationValidationSerivce: IAdministrationValidationService) {
        this.globalRepo = globalRepo;
        this.paymentService = paymentService;
        this.administrationValidationSerivce = administrationValidationSerivce;
    }

    public async execute(req: CreateGlobalShopDTO.Request): Promise<CreateGlobalShopDTO.Response> {
        const valid = this.administrationValidationSerivce.createGlobalShopData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const globalGotten = await this.globalRepo.getGlobal();
        if (globalGotten.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting global'));
        }

        const global = globalGotten.getValue()!;

        const shopInfo: IRegistrationData = {
            addresses: req.addresses.map(a => {a.country = 'RUS'; return a;}),
            bankAccount: req.bankAccount,
            billingDescriptor: req.billingDescriptor,
            ceo: req.ceo,
            email: req.email,
            phones: req.phones,
            fullName: req.fullName,
            inn: req.inn,
            kpp: req.kpp,
            name: req.name,
            ogrn: req.ogrn,
            shopArticleId: new Types.ObjectId().toString(),
            siteUrl: configProps.frontendUrl
        };

        const shopCreated = await this.paymentService.createShop(shopInfo);
        if (shopCreated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon creating shop'));
        }

        const shop = shopCreated.getValue()!;

        global.paymentShopId = shop.shopCode;

        const globalSaved = await this.globalRepo.save(global);
        if (globalSaved.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon saving global'));
        }

        return Result.ok({globalId: global._id});
    }
}
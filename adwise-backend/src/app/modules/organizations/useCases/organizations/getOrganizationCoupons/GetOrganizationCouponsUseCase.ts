import { Types } from "mongoose";
import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { ICoupon } from "../../../models/Coupon";
import { ICouponRepo } from "../../../repo/coupons/ICouponRepo";
import { IOrganizationValidationService } from "../../../services/organizations/organizationValidationService/IOrganizationValidationService";
import { GetOrganizationCouponsDTO } from "./GetOrganizationCouponsDTO";
import { getOrganizationCouponsErrors } from './getOrganizationCouponsErrors';
import moment from 'moment';

export class GetOrganizationCouponsUseCase implements IUseCase<GetOrganizationCouponsDTO.Request, GetOrganizationCouponsDTO.Response> {
    private couponRepo: ICouponRepo;
    private organizationValidationService: IOrganizationValidationService;
    private xlsxService: IXlsxService;

    public errors: UseCaseError[] = [
        ...getOrganizationCouponsErrors
    ];

    constructor(couponRepo: ICouponRepo, organizationValidationService: IOrganizationValidationService, xlsxService: IXlsxService) {
        this.couponRepo = couponRepo;
        this.organizationValidationService = organizationValidationService;
        this.xlsxService = xlsxService;
    }

    public async execute(req: GetOrganizationCouponsDTO.Request): Promise<GetOrganizationCouponsDTO.Response> {
        const valid = this.organizationValidationService.getOrganizationCouponsData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        if (req.export) {
            req.limit = 100000;
            req.page = 1;
        }

        const couponsFound = await this.couponRepo.findByOrganization(req.organizationId, req.limit, req.page, req.all, req.type, req.disabled);
        if (couponsFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon finding coupons'));
        }

        const coupons = couponsFound.getValue()!;

        const populatedCoupons: any[] = [];

        for (const coupon of coupons as any[]) {
            const populatedCoupon: any = await coupon.populate('offer').populate('organization', 'picture mainPicture name description briefDescription colors').execPopulate()
            
            populatedCoupon.organizationInfo = (<any>populatedCoupon.organization).toObject();
            populatedCoupon.organization = (<any>populatedCoupon.organization)._id

            populatedCoupons.push(populatedCoupon);
        }

        if (req.export) {
            const couponsExported = await this.exportToXlsx(coupons);
            if (couponsExported.isFailure) {
                return Result.fail(couponsExported.getError()!);
            }

            const xlsx = couponsExported.getValue()!;

            return Result.ok({coupons: xlsx as any, count: 0});
        }

        const keys: string[] = ['organization'];
        const values: any[] = [req.organizationId];

        if (!req.all) {
            keys.push('disabled');
            values.push('false');
        }

        if (req.disabled) {
            if (!req.all) {
                keys.pop();
                values.pop();
            }

            keys.push('disabled');
            values.push('true');
        }

        if (req.type) {
            keys.push('type');
            values.push(req.type);
        }

        console.log(keys, values);

        const couponsCounted = await this.couponRepo.count(keys, values);
        if (couponsCounted.isFailure) {
            console.log(couponsCounted.getError());
            return Result.fail(UseCaseError.create('a', 'Error upon counting coupons'));
        }

        const count = couponsCounted.getValue()!;

        return Result.ok({coupons: populatedCoupons, count});
    }

    private async exportToXlsx(coupons: ICoupon[]): Promise<Result<Buffer | null, UseCaseError | null>>{       
        const xlsxGenerated = await this.xlsxService.convert(coupons.map(c => {
            const startDate = moment(c.startDate).format('DD.MM.YYYY HH:mm');

            return {
                'Дата': startDate,
                'Наименование': c.name,
                'Тип акции': c.type == 'service' ? 'Услуга' : 'Товар',
                'Стоимость': c.price + ' ₽',
                'Общее кол-во': c.quantity,
                'Кол-во использ.': c.initialQuantity - c.quantity,
                'Сумма оплат': c.purchaseSum + ' ₽',
                'Сумма кэшбэка': c.offerSum + ' ₽',
                'Сумма маркетинга': c.marketingSum + ' ₽',
                'Порядок сортировки': c.index,
                'Статус': c.disabled ? 'Отключеная' : 'Активная',
            };
        }));
        if (xlsxGenerated.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
        }

        const xlsx = xlsxGenerated.getValue()!;

        return Result.ok(xlsx);
    }
}
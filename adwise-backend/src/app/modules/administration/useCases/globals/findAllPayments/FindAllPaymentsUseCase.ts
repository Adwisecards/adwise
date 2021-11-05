import { IUseCase } from "../../../../../core/models/interfaces/IUseCase";
import { Result } from "../../../../../core/models/Result";
import { UseCaseError } from "../../../../../core/models/UseCaseError";
import { IXlsxService } from "../../../../../services/xlsxService/IXlsxService";
import { IPayment } from "../../../../finance/models/Payment";
import { IPaymentRepo } from "../../../../finance/repo/payments/IPaymentRepo";
import { AdministrationValidationService } from "../../../services/administrationValidationService/implementation/AdministrationValidationService";
import { FindAllPaymentsDTO } from "./FindAllPaymentsDTO";
import { findAllPaymentsErrors } from "./findAllPaymentsErrors";
import moment from 'moment';

export class FindAllPaymentsUseCase implements IUseCase<FindAllPaymentsDTO.Request, FindAllPaymentsDTO.Response> {
    private xlsxService: IXlsxService;
    private paymentRepo: IPaymentRepo;
    private administrationValidationService: AdministrationValidationService;

    public errors = findAllPaymentsErrors;

    constructor(
        xlsxService: IXlsxService,
        paymentRepo: IPaymentRepo, 
        administrationValidationService: AdministrationValidationService
    ) {
        this.xlsxService = xlsxService;
        this.paymentRepo = paymentRepo;
        this.administrationValidationService = administrationValidationService;
    }

    public async execute(req: FindAllPaymentsDTO.Request): Promise<FindAllPaymentsDTO.Response> {
        const valid = this.administrationValidationService.findData(req);
        if (valid.isFailure) {
            return Result.fail(UseCaseError.create('c', valid.getError()!));
        }

        const parameterNames: string[] = [];
        const parameterValues: string[] = [];

        for (const key in req) {
            if (key == 'sortBy' || key == 'order' || key == 'pageSize' || key == 'pageNumber' || key == 'export') continue;
            parameterNames.push(key);
            parameterValues.push((<any>req)[key]);
        }

        let payments: IPayment[] = [];

        if (req.export) {
            const paymentsFound = await this.paymentRepo.search(parameterNames, parameterValues, req.sortBy, req.order, 20000, 1, 'purchase');
            if (paymentsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding payments'));
            }

            payments = paymentsFound.getValue()!;
        } else {
            const paymentsFound = await this.paymentRepo.search(parameterNames, parameterValues, req.sortBy, req.order, req.pageSize, req.pageNumber, 'purchase');
            if (paymentsFound.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon finding payments'));
            }

            payments = paymentsFound.getValue()!;
        }

        const paymentsWithTimestamp: any[] = [];

        for (const payment of payments) {
            paymentsWithTimestamp.push({
                ...payment.toObject(),
                timestamp: payment._id.getTimestamp()
            })
        }

        if (req.export) {
            const xlsxGenerated = this.xlsxService.convert(paymentsWithTimestamp.map(p => {

                const date = moment(p.timestamp).format("DD.MM.YYYY / HH:mm");

                return {
                    'Дата / время': date,
                    'ID сделки': p._id,
                    'Тип сделки': p.type == 'purchase' ? 'Покупка' : 'Наличные',
                    'Сумма сделки': p.sum + ' ₽',
                    'Использовано баллов': p.usedPoints + ' ₽',
                    'Оплачено': p.paid ? 'Да' : 'Нет',
                    'ID покупки': p.ref.toString()
                };
            }));
            
            if (xlsxGenerated.isFailure) {
                return Result.fail(UseCaseError.create('a', 'Error upon generating xlsx'));
            }
    
            const xlsx = xlsxGenerated.getValue()!;

            return Result.ok({payments: xlsx as any, count: -1});
        }

        const countFound = await this.paymentRepo.count(parameterNames, parameterValues);
        if (countFound.isFailure) {
            return Result.fail(UseCaseError.create('a', 'Error upon getting count'));
        }

        const count = countFound.getValue()!;

        return Result.ok({payments: paymentsWithTimestamp, count});
    }
}